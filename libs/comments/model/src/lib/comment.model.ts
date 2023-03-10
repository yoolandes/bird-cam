export interface Comment {
  author: string;
  createdAt: string;
  id: number;
  text: string;
  updatedAt: string;
}

export type CreateCommentDto = Omit<Comment, 'updatedAt' | 'createdAt' |'id'>;
