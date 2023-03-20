export interface JanusMessage {
  event: {
    data?: {
      event: JanusEvent;
      id: number;
      display: string;
    };
  };
}

export enum JanusEvent {
  Joined = 'joined',
  Leaving = 'leaving',
}
