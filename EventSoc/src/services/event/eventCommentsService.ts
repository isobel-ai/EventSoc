export async function createComment(
  eventId: string,
  authorId: string,
  contents: string,
  isExecComment: boolean
) {
  const comment: CommentData = {
    ...defaultCommentData(),
    author: await retrieveUserOverview(authorId),
    contents: contents,
    isExecComment: isExecComment
  };
  await addDoc(eventCommentsCol(eventId), comment);
}

export function retrieveComments(eventId: string) {
  return getDocs(
    query(eventCommentsCol(eventId), orderBy("timestamp", "desc"))
  ).then((commentsSnapshot) => commentsSnapshot.docs.map(docToCommentDoc));
}
