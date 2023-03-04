export interface Comment {
    text: string;
    author: string;
    id?: number;
    creationDate?: string;
    likesCount?: number;
    pinned?: boolean;
    active?: boolean;
    comments?: Comment[];
  }