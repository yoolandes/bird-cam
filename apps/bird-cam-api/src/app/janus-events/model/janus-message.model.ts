export interface JanusMessage {
  type: number;
  subtype: number;
  event: {
    plugin: Plugin;
    name: Name;
    opaque_id: string;
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
  Detached = 'detached',
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
