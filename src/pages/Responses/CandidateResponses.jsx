import React from 'react'
import Response from '../../firebase/responses';
import { useParams } from 'react-router-dom';
import ResponsesTable from './ResponsesTable';
import Loader from '../../components/Loader';
import { millisecondToTime } from '../../utils/helpers';
import LessonResponse from '../../firebase/LessonResponses';
import LessonResponsesTable from './LessonResponsesTable';

function CandidateResponses() {
    const response = new Response();
    const lessonResponse = new LessonResponse();
    const { id } = useParams();
    const [responsesLoading, setResponsesLoading] = React.useState(true)
    const [lessonResponsesLoading, setLessonResponsesLoading] = React.useState(true)
    const [responses, setResponses] = React.useState();
    const [lessonResponses, setLessonResponses] = React.useState();
    const [responseTableData, setResponseTableData] = React.useState([]);
    const [lessonResponseTableData, setLessonResponseTableData] = React.useState([])


    React.useEffect(() => {
        setResponsesLoading(true)
        setLessonResponsesLoading(true)
        response.getResponsesOfCandidate(id).then(res => {
            setResponses(res.response)
            setResponseTableData(res.response.map(item => ({
                id: item.id,
                userId: item.data.userId,
                timeRequired: millisecondToTime(item.data.timeRequired),
                answer: item.data.answer,
                sceneName: item.data.sceneName,
                sceneId: item.data.sceneId,
                ...(item.data.extraResponse && {extraResponse: {
                    allowedScenario: item.data.extraResponse.allowedScenario,
                    deniedScenario: item.data.extraResponse.deniedScenario
                }})
            })))
            setResponsesLoading(false)
        })
        lessonResponse.getLessonResponsesOfCandidate(id).then(res => {
            setLessonResponses(res.response)
            setLessonResponseTableData(res.response.map(item => ({
                id: item.id,
                candidateId: item.data.candidateId,
                lessonType: item.data.lesson.type,
                lessonId: item.data.lesson.id,
                score: item.data.score,
                total: item.data.total,
                elapsedTime: item.data.elapsedTime ? millisecondToTime(item.data.elapsedTime) : 'N/A',
                responses: item.data.responses
            })))
            setLessonResponsesLoading(false)
        })
    }, [])

    
    
  return (
    <div>
        <h3>All Responses Of Candidate {id}</h3>
        <Loader isLoading={responsesLoading}>
            <ResponsesTable data={responseTableData} />
        </Loader>
        <br /><br />
        <h3>All Lesson Responses Of Candidate {id}</h3>
        <Loader isLoading={lessonResponsesLoading}>
            <LessonResponsesTable data={lessonResponseTableData} />
        </Loader>
    </div>
  )
}

export default CandidateResponses