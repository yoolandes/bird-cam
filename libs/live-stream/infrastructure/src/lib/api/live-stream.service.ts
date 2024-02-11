import { Injectable } from '@angular/core';
import { StreamProgress } from 'libs/live-stream/model/src';
import { ReplaySubject, Subject } from 'rxjs';

declare const Janus: any;

@Injectable({
  providedIn: 'root',
})
export class LiveStreamService {
  private janus: any;
  private videoRoomPluginHandle: any;

  private readonly roomId = 1234;

  private myid = null;
  private mypvtid = null;

  private readonly feeds: any[] = [];

  private readonly stream = new ReplaySubject<any>();
  readonly stream$ = this.stream.asObservable();

  readonly progress = new Subject<StreamProgress>();
  readonly progress$ = this.progress.asObservable();

  getStream(): void {
    if (!Janus.isWebrtcSupported()) {
      this.stream.error(new Error('No Webrtc'));
    } else {
      Janus.init({
        callback: () => {
          this.attachPlugin();
        },
        error: (_: any, err: Error) => {
          this.stream.error(err);
        },
      });
    }
  }

  private attachPlugin(): void {
    this.janus = new Janus({
      server: '/janus',
      iceServers: [
        {
          urls: 'turn:a.relay.metered.ca:80',
          username: '06857f7aa8f2eade65c72205',
          credential: 'x6azWvpCiK4/xJJK',
        },
        {
          urls: 'stun:stun.relay.metered.ca:80',
        },
      ],
      success: () => {
        this.janus.attach({
          plugin: 'janus.plugin.videoroom',
          success: (pluginHandle: any) => {
            this.videoRoomPluginHandle = pluginHandle;
            this.progress.next(StreamProgress.PluginAttached);
            this.registerUsername();
          },
          error: (error: any) => {
            this.stream.error(error);
          },
          iceState(state: any) {
            this.blub('ICE state changed to ' + state);
          },
          mediaState(medium: any, on: any) {
            this.blub(
              'Janus ' +
                (on ? 'started' : 'stopped') +
                ' receiving our ' +
                medium
            );
          },
          webrtcState(on: any) {
            this.blub(
              'Janus says our WebRTC PeerConnection is ' +
                (on ? 'up' : 'down') +
                ' now'
            );
          },
          onmessage: (msg: any) => {
            this.blub(' ::: Got a message (publisher) :::', msg);
            let event = msg.videoroom;
            this.blub('Event: ' + event);
            if (event) {
              if (event === 'joined') {
                this.myid = msg.id;
                this.mypvtid = msg.private_id;
                this.blub(
                  'Successfully joined room ' +
                    msg.room +
                    ' with ID ' +
                    this.myid
                );
                this.progress.next(StreamProgress.JoinedRoom);
                // Any new feed to attach to?
                if (msg.publishers) {
                  let list = msg.publishers;
                  this.blub('Got a list of available publishers/feeds:', list);
                  for (let f in list) {
                    let id = list[f].id;
                    let display = list[f].display;
                    let audio = list[f].audio_codec;
                    let video = list[f].video_codec;
                    this.blub(
                      '  >> [' +
                        id +
                        '] ' +
                        display +
                        ' (audio: ' +
                        audio +
                        ', video: ' +
                        video +
                        ')'
                    );
                    this.newRemoteFeed(id, display, audio, video);
                  }
                }
              } else if (event === 'destroyed') {
                this.blub('The room has been destroyed!');
              } else if (event === 'event') {
                // Any new feed to attach to?
                if (msg.publishers) {
                  let list = msg.publishers;
                  this.blub('Got a list of available publishers/feeds:', list);
                  // this.webrtcProgressListenerService.changeProgress(Progress.GotFeed);
                  for (let f in list) {
                    let id = list[f].id;
                    let display = list[f].display;
                    let audio = list[f].audio_codec;
                    let video = list[f].video_codec;
                    this.blub(
                      '  >> [' +
                        id +
                        '] ' +
                        display +
                        ' (audio: ' +
                        audio +
                        ', video: ' +
                        video +
                        ')'
                    );
                    this.newRemoteFeed(id, display, audio, video);
                  }
                } else if (msg.leaving) {
                  // One of the publishers has gone away?
                  let leaving = msg.leaving;
                  this.blub('Publisher left: ' + leaving);
                  let remoteFeed = null;
                  for (let i = 1; i < 6; i++) {
                    if (this.feeds[i] && this.feeds[i].rfid == leaving) {
                      remoteFeed = this.feeds[i];
                      break;
                    }
                  }
                  if (remoteFeed != null) {
                    this.blub(
                      'Feed ' +
                        remoteFeed.rfid +
                        ' (' +
                        remoteFeed.rfdisplay +
                        ') has left the room, detaching'
                    );
                    this.feeds[remoteFeed.rfindex] = null;
                    remoteFeed.detach();
                  }
                } else if (msg.unpublished) {
                  // One of the publishers has unpublished?
                  let unpublished = msg.unpublished;
                  this.blub('Publisher left: ' + unpublished);
                  if (unpublished === 'ok') {
                    // That's us
                    this.videoRoomPluginHandle.hangup();
                    return;
                  }
                  let remoteFeed = null;
                  for (let i = 1; i < 6; i++) {
                    if (this.feeds[i] && this.feeds[i].rfid == unpublished) {
                      remoteFeed = this.feeds[i];
                      break;
                    }
                  }
                  if (remoteFeed != null) {
                    this.blub(
                      'Feed ' +
                        remoteFeed.rfid +
                        ' (' +
                        remoteFeed.rfdisplay +
                        ') has left the room, detaching'
                    );
                    this.feeds[remoteFeed.rfindex] = null;
                    remoteFeed.detach();
                  }
                } else if (msg.error) {
                  if (msg.error_code === 426) {
                    // This is a "no such room" error: give a more meaningful description
                  }
                }
              }
            }
          },
          oncleanup: () => {
            this.stream.next(undefined);
          },
        });
      },
      error: (error: string) => {
        this.stream.error(new Error('Can not reach Janus server'));
      },
      destroyed() {
        window.location.reload();
      },
    });
  }

  private registerUsername(): void {
    let register = {
      request: 'join',
      room: this.roomId,
      ptype: 'publisher',
      display: 'its me',
    };
    this.videoRoomPluginHandle.send({ message: register });
  }

  private newRemoteFeed(id: any, display: any, audio: any, video: any): void {
    // A new feed has been published, create a new plugin handle and attach to it as a subscriber
    let remoteFeed: any = null;
    this.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: (pluginHandle: any) => {
        remoteFeed = pluginHandle;
        this.blub(
          'Plugin attached! (' +
            remoteFeed.getPlugin() +
            ', id=' +
            remoteFeed.getId() +
            ')'
        );
        this.blub('  -- This is a subscriber');
        // We wait for the plugin to send us an offer
        let subscribe = {
          request: 'join',
          room: this.roomId,
          ptype: 'subscriber',
          feed: id,
          private_id: this.mypvtid,
        };

        remoteFeed.send({ message: subscribe });
      },
      error: (error: any) => {
        this.blub('  -- Error attaching plugin...', error);
      },
      onmessage: (msg: any, jsep: any) => {
        this.blub(' ::: Got a message (subscriber) :::', msg);
        let event = msg.videoroom;
        this.blub('Event: ' + event);
        if (msg.error) {
        } else if (event) {
          if (event === 'attached') {
            // Subscriber created and attached
            for (let i = 1; i < 2; i++) {
              if (!this.feeds[i]) {
                this.feeds[i] = remoteFeed;
                remoteFeed.rfindex = i;
                break;
              }
            }
            remoteFeed.rfid = msg.id;
            remoteFeed.rfdisplay = msg.display;

            this.blub(
              'Successfully attached to feed ' +
                remoteFeed.rfid +
                ' (' +
                remoteFeed.rfdisplay +
                ') in room ' +
                msg.room
            );
            this.progress.next(StreamProgress.AttachedToFeed);
          }
        }
        if (jsep) {
          this.blub('Handling SDP as well...', jsep);
          // Answer and attach
          remoteFeed.createAnswer({
            jsep,
            // Add data:true here if you want to subscribe to datachannels as well
            // (obviously only works if the publisher offered them in the first place)
            media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
            success: (jsep: any) => {
              this.blub('Got SDP!', jsep);
              let body = { request: 'start', room: this.roomId };
              remoteFeed.send({ message: body, jsep });
            },
            error(error: any) {
              this.blub('WebRTC error:', error);
            },
          });
        }
      },
      iceState: (state: any) => {
        this.blub(
          'ICE state of this WebRTC PeerConnection (feed #' +
            remoteFeed.rfindex +
            ') changed to ' +
            state
        );
      },
      webrtcState: (on: any) => {
        this.blub(
          'Janus says this WebRTC PeerConnection (feed #' +
            remoteFeed.rfindex +
            ') is ' +
            (on ? 'up' : 'down') +
            ' now'
        );
        if (on) {
          this.progress.next(StreamProgress.ConnectionIsUp);
        }
      },
      onremotestream: (stream: any) => {
        console.log(stream);
        this.blub('Remote feed #' + remoteFeed.rfindex + ', stream:', stream);
        this.stream.next(stream);
      },
      oncleanup: () => {
        this.blub(
          ' ::: Got a cleanup notification (remote feed ' + id + ') :::'
        );
      },
    });
  }

  private blub(text: string, dings?: any) {
    console.log(text);
  }
}
