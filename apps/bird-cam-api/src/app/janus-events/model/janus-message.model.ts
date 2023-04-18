export interface JanusMessage {
  type: number;
  event: {
    data?: {
      event: JanusEvent;
      id: number;
      display?: string;
    };
  };
}

export enum JanusEvent {
  Joined = 'joined',
  Leaving = 'leaving',
  Published = 'published',
  Unpublished = 'unpublished',
}
