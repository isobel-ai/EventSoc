import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { isUndefined } from "lodash";
import {
  EventData,
  EventDocAndRecScore,
  EventOverview
} from "../../../Shared/models/Event";

export function docToEventDocAndRecScore(
  doc: DocumentSnapshot<DocumentData, DocumentData>,
  score: number
): EventDocAndRecScore {
  return {
    id: doc.id,
    data: docToEventData(doc),
    score: score
  };
}

export function docToEventData(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  return {
    ...data,
    startDate: data.startDate.toDate(),
    endDate: data.endDate.toDate()
  } as EventData;
}

export function docToEventOverviewNarrow(
  doc: DocumentSnapshot<DocumentData, DocumentData>
) {
  const data = doc.data();

  if (isUndefined(data)) {
    throw Error(`Document ${doc.ref.path} does not exist`);
  }

  const eventOverview: EventOverview = {
    id: doc.id,
    name: data.name,
    organiserId: data.organiser?.id ?? data.organiserId,
    startDate: data.startDate.toDate(),
    endDate: data.endDate.toDate()
  };

  return eventOverview;
}
