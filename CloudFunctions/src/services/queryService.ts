import { firestore } from "firebase-admin";
import * as logger from "firebase-functions/logger";

export function updateQueryDocs<Data>(
  query: firestore.Query<firestore.DocumentData, firestore.DocumentData>,
  data: Partial<Data>
) {
  query
    .select()
    .get()
    .then((queryDocsSnapshot) =>
      queryDocsSnapshot.docs.map((doc) =>
        doc.ref
          .update(data)
          .then(() => logger.info(`${doc.ref.path} updated`))
          .catch((err) => logger.error(err.message))
      )
    );
}

export function deleteQueryDocs(
  query: firestore.Query<firestore.DocumentData, firestore.DocumentData>
) {
  query
    .select()
    .get()
    .then((queryDocsSnapshot) =>
      queryDocsSnapshot.docs.map((doc) =>
        doc.ref
          .delete()
          .then(() => logger.info(`${doc.ref.path} deleted`))
          .catch((err) => logger.error(err.message))
      )
    );
}
