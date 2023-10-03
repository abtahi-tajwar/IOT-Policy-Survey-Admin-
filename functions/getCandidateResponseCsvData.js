import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "./src/init";

export const handler = async function (event, context) {
  const lessonResponsePromise = getLessons();
  const lessonResponseSortedByUserPromise =
    getSortedLessonResponseGroupByUser();

  const [ lessonsData, lessonResponseDataByUser ] = await Promise.all([
    lessonResponsePromise,
    lessonResponseSortedByUserPromise,
  ]);

  const csvData = [[ "Candidate Id", "Lesson Type", "Score", "Total Score", "Lesson Name", "Response", "Question" ]]
  Object.keys(lessonResponseDataByUser).forEach((userIdKey) => {
    const userResponses = lessonResponseDataByUser[userIdKey]
    userResponses.forEach((userResponse) => {
        const candidateId = userIdKey
        const lessonType = userResponse.data.lesson.type
        const lessonData = lessonsData.find(l => l.id === userResponse.data.lesson.id)
        const lessonName = lessonData?.data?.name ?? null
        userResponse.data.responses.forEach((response, ri) => {
            let score = null
            let totalScore = null
            let question = null
            let responseString = null

            if (lessonData) {
              if (lessonType === 'mcq') {
                  const questionData = lessonData.data.questions[ri]
                  if (questionData) {
                      question = questionData.question
                      const answer = questionData.answer.index
                      score = (answer === response) ? 1 : 0
                      totalScore = 1
                      responseString = questionData.options[response]
                  }
              } else if (lessonType === 'dnd') {
                  const blankData = lessonData.data.blanks[ri]
                  if (blankData) {
                      question = blankData.question.join(" ")
                      totalScore = blankData.answers.length
                      score = 0
                      response['_'].forEach((part, pi) => {
                          score += (part.answer === blankData.answers[pi]) ? 1 : 0
                          responseString += part.answer+';'
                      })
                  }
              } else if (lessonType === 'demographics') {
                  const questionData = lessonData.data.questions[ri]
                  if (questionData) {
                      question = questionData.question
                      score = 'n/a'
                      totalScore = 'n/a'
                      responseString = questionData.options[response]
                  }
              } else if (lessonType === 'attention_check') {
                  const questionData = lessonData.data.questions[ri]
                  if (questionData) {
                      question = questionData.question
                      score = 'n/a'
                      totalScore = 'n/a'
                      responseString = response
                  }
              } 
            }

            csvData.push([ candidateId, lessonType, score, totalScore, lessonName, responseString, question ])
        })
    })
  })
  return {
    statusCode: 200,
    body: JSON.stringify( csvData ),
  };
};

const getSortedLessonResponseGroupByUser = () => {
  return new Promise(async (resolve, reject) => {
    const db = getFirestore(app);

    try {
      const querySnapshot = await getDocs(collection(db, "lessson_responses"));
      const result = {};

      querySnapshot.forEach((item) => {
        const candidateId = item.data().candidateId;
        if (candidateId in result) {
          result[candidateId].push({
            id: item.id,
            data: item.data(),
          });
        } else {
          result[candidateId] = [
            {
              id: item.id,
              data: item.data(),
            },
          ];
        }
      });

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getLessons = () => {
  return new Promise(async (resolve, reject) => {
    const db = getFirestore(app);

    try {
      const querySnapshot = await getDocs(collection(db, "lessons"));
      const result = [];

      querySnapshot.forEach((item) => {
        result.push({
          id: item.id,
          data: item.data(),
        });
      });

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
