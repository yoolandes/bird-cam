export interface JanusMessage {
  type: number;
  event: {
    plugin: Plugin;
    name: Name;
    data?: {
      event: JanusEvent;
      id: number;
      display?: string;
      status: StreamingStatus;
    };
  };
}

export enum Plugin {
  Streaming = 'janus.plugin.streaming',
}

export enum Name {
  Attached = 'attached',
}

export enum JanusEvent {
  Joined = 'joined',
  Leaving = 'leaving',
  Published = 'published',
  Unpublished = 'unpublished',
  Configured = 'configured',
}

export enum StreamingStatus {
  Starting = 'starting',
}
