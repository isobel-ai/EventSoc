export interface Comment {
  id: string;
  data: CommentData;
}

export interface CommentData {
  authorId: string;
  contents: string;
  timestamp: Date;
  parentId: string;
  replyIds: string[];
}

export const defaultCommentData: () => CommentData = () => {
  return {
    authorId: "",
    contents: "",
    timestamp: new Date(),
    parentId: "",
    replyIds: <string[]>[]
  };
};

export interface CommentAncestry {
  ancestry: Comment[];
  error?: Error;
}
