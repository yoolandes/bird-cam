export interface Snapshot {
  id: number;
  filePath: string;
  date: Date;
  snapshotCause: SnapshotCause;
}

export enum SnapshotCause {
  Interval,
  Motion,
}
