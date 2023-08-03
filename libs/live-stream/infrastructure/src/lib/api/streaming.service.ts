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

  streaming: any;

  selectedStream: any;

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

  updateStreamsList() {
    var body = { request: 'list' };
    this.streaming.send({
      message: body,
      success: (result: any) => {
        this.startStream();
      },
    });
  }

  stopStream() {
    var body = { request: 'stop' };
    this.streaming.send({ message: body });
    this.streaming.hangup();

    // if(bitrateTimer)
    //   clearInterval(bitrateTimer);
    // bitrateTimer = null;

    // simulcastStarted = false;
  }

  getStreamInfo() {
    // if (!this.selectedStream) return;
    // var body = {
    //   request: 'info',
    //   id: parseInt(this.selectedStream) || this.selectedStream,
    // };
    // this.streaming.send({
    //   message: body,
    //   success: (result: any) => {
    //     this.startStream(99);
    //   },
    // });
  }

  startStream() {
    // Janus.log('Selected video id #' + this.selectedStream);
    // if (!this.selectedStream) {
    //   return;
    // }
    var body = {
      request: 'watch',
      id: 99,
    };
    this.streaming.send({ message: body });
    // Get some more info for the mountpoint to display, if any
    this.getStreamInfo();
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
      ],
      success: () => {
        this.janus.attach({
          plugin: 'janus.plugin.streaming',
          opaqueId: '123',
          success: (pluginHandle: any) => {
            this.streaming = pluginHandle;
            this.progress.next(StreamProgress.PluginAttached);
            this.updateStreamsList();
          },
          error: (error: any) => {
            this.stream.error(error);
          },
          iceState(state: any) {
            Janus.log('ICE state changed to ' + state);
          },
          webrtcState(on: any) {
            Janus.log(
              'Janus says our WebRTC PeerConnection is ' +
                (on ? 'up' : 'down') +
                ' now'
            );
          },
          onmessage: (msg: any, jsep: any) => {
            Janus.debug(' ::: Got a message :::', msg);
            var result = msg['result'];
            if (result) {
              if (result['status']) {
                var status = result['status'];
                if (status === 'stopped') {
                  this.stopStream();
                }
              } else if (msg['streaming'] === 'event') {
                // var substream = result["substream"];
                // var temporal = result["temporal"];
                // if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                // 	if(!simulcastStarted) {
                // 		simulcastStarted = true;
                // 		addSimulcastButtons(temporal !== null && temporal !== undefined);
                // 	}
                // 	// We just received notice that there's been a switch, update the buttons
                // 	updateSimulcastButtons(substream, temporal);
                // }
                // // Is VP9/SVC in place?
                // var spatial = result["spatial_layer"];
                // temporal = result["temporal_layer"];
                // if((spatial !== null && spatial !== undefined) || (temporal !== null && temporal !== undefined)) {
                // 	if(!svcStarted) {
                // 		svcStarted = true;
                // 		addSvcButtons();
                // 	}
                // 	// We just received notice that there's been a switch, update the buttons
                // 	updateSvcButtons(spatial, temporal);
                // }
              }
            } else if (msg['error']) {
              this.stopStream();
              return;
            }
            if (jsep) {
              Janus.debug('Handling SDP as well...', jsep);
              var stereo = jsep.sdp.indexOf('stereo=1') !== -1;
              // Offer from the plugin, let's answer
              this.streaming.createAnswer({
                jsep: jsep,
                // We want recvonly audio/video and, if negotiated, datachannels
                media: { audioSend: false, videoSend: false, data: true },
                customizeSdp: (jsep: any) => {
                  if (stereo && jsep.sdp.indexOf('stereo=1') == -1) {
                    // Make sure that our offer contains stereo too
                    jsep.sdp = jsep.sdp.replace(
                      'useinbandfec=1',
                      'useinbandfec=1;stereo=1'
                    );
                  }
                },
                success: (jsep: any) => {
                  Janus.debug('Got SDP!', jsep);
                  var body = { request: 'start' };
                  this.streaming.send({ message: body, jsep: jsep });
                },
                error: (error: any) => {
                  Janus.error('WebRTC error:', error);
                },
              });
            }
          },
          onremotestream: (stream: any) => {
            console.log(stream);
            this.stream.next(stream);
            console.log(this.streaming.getBitrate());
          },
          oncleanup: function () {
            Janus.log(' ::: Got a cleanup notification :::');
          },
        });
      },
      error: (error: any) => {
        Janus.error(error);
      },
      destroyed: function () {
        window.location.reload();
      },
    });
  }
}
