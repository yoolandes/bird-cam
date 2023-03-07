export interface Comment {
    text: string;
    author: string;
    id?: number;
    createdAt?: string;
    likesCount?: number;
    pinned?: boolean;
    active?: boolean;
    comments?: Comment[];
  }