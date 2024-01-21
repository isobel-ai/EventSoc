export interface Comment {
  id: string;
  data: CommentData;
}

export interface CommentData {
  authorId: string;
  contents: string;
  timestamp: Date;
  replyIds: string[];
}

export const defaultCommentData: () => CommentData = () => {
  return {
    authorId: "",
    contents: "",
    timestamp: new Date(),
    replyIds: <string[]>[]
  };
};
