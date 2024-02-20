import * as logger from "firebase-functions/logger";

export async function calculateAvgTagInterestScore(
  eventTags: string[],
  userInterests: string[]
) {
  const retrieveTagsInterestsScores = eventTags.map((tag) =>
    retrieveTagInterestsScores(tag, userInterests)
  );

  const tagInterestScores = await Promise.all(retrieveTagsInterestsScores).then(
    (scores) => scores.flat()
  );

  const avgTagInterestScore = tagInterestScores.length
    ? tagInterestScores.reduce((sum, curVal) => sum + curVal) /
      tagInterestScores.length
    : 0;

  return avgTagInterestScore;
}

function retrieveTagInterestsScores(
  eventTag: string,
  userInterests: string[]
): Promise<number[]> {
  if (!userInterests.length) {
    return Promise.resolve([]);
  }

  const body = JSON.stringify({
    inputs: {
      source_sentence: eventTag,
      sentences: userInterests
    }
  });

  return fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      headers: {
        Authorization: "Bearer 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"
      },
      method: "POST",
      body: body
    }
  )
    .then((response) => response.json())
    .catch((err) => {
      logger.error(err.message);
      return [];
    });
}
