import { DocumentReference } from "@firebase/firestore-types";
import { UserOverview, defaultUserOverview } from "./User";

export type Comment = {
  id: string;
  data: CommentData;
};

export type CommentData = {
  author: UserOverview;
  contents: string;
  isExecComment: boolean;
  timestamp: Date;
};

export function defaultCommentData(): CommentData {
  return {
    author: defaultUserOverview(),
    contents: "",
    isExecComment: false,
    timestamp: new Date(),
  };
}

export type Reply = {
  id: string;
  data: ReplyData;
};

export type ReplyData = CommentData & {
  replies: DocumentReference[];
};
