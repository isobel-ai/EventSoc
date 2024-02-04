import { DocumentReference } from "@firebase/firestore-types";
import { UserOverviewData, defaultUserOverview } from "./User";

export type CommentDoc = {
  id: string;
  data: CommentData;
};

export type CommentData = {
  author: UserOverviewData;
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

export type ReplyDoc = {
  id: string;
  data: ReplyData;
};

export type ReplyData = CommentData & {
  replies: DocumentReference[];
};
