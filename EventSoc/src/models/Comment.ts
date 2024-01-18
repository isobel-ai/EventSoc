export interface Comment {
  id: string;
  data: CommentData;
}

export interface CommentData {
  authorId: string;
  contents: string;
  replyIds: string[];
}

export const defaultCommentData: () => CommentData = () => {
  return { authorId: "", contents: "", replyIds: <string[]>[] };
};
