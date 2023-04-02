import React from 'react'
import Response from '../../firebase/responses';
import { useParams } from 'react-router-dom';
import ResponsesTable from './ResponsesTable';
import Loader from '../../components/Loader';
import { millisecondToTime } from '../../utils/helpers';

function CandidateResponses() {
    const response = new Response();
    const { id } = useParams();
    const [loading, setLoading] = React.useState(true)
    const [responses, setResponses] = React.useState();
    const [tableData, setTableData] = React.useState([])

    React.useEffect(() => {
        setLoading(true)
        response.getResponsesOfCandidate(id).then(res => {
            setResponses(res.response)
            setTableData(res.response.map(item => ({
                id: item.id,
                userId: item.data.userId,
                timeRequired: millisecondToTime(item.data.timeRequired),
                answer: item.data.answer,
                sceneName: item.data.sceneName,
                sceneId: item.data.sceneId
            })))
            setLoading(false)
        })
    }, [])
    
    
  return (
    <div>
        <Loader isLoading={loading}>
            <h3>All Responses Of Candidate {id}</h3>
            <ResponsesTable data={tableData} />
        </Loader>
    </div>
  )
}

export default CandidateResponses