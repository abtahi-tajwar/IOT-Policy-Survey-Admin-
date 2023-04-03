import React from 'react'
import Response from '../../firebase/responses';
import { useParams } from 'react-router-dom';
import ResponsesTable from './ResponsesTable';
import Loader from '../../components/Loader';
import { millisecondToTime } from '../../utils/helpers';
import { CSVLink, CSVDownload } from "react-csv";
import { Button } from '@mui/material';
import styled from '@emotion/styled';

function AllResponses() {
    const response = new Response();
    const csvLabels = ["id", "userId", "timeRequired", "answer", "sceneName", "sceneId"]
    const [loading, setLoading] = React.useState(true)
    const [responses, setResponses] = React.useState();
    const [allResponse, setAllResponse] = React.useState([])
    const [csvData, setCsvData] = React.useState()
    const [tableData, setTableData] = React.useState([])

    React.useEffect(() => {
        setLoading(true)
        response.get().then(res => {
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
        populateCSVData()
    }, [])
    
    const populateCSVData = () => {
        response.getAll().then(res => {
            setAllResponse(res.response)
            const _csvData = res.response.map(item => ([ item.id, item.data.userId, millisecondToTime(item.data.timeRequired), item.data.answer, item.data.sceneName, item.data.sceneId ]))
            setCsvData([
                csvLabels,
                ..._csvData
            ])
        })          
    }

    const handleJSONFileDownload = () => {
        // create file in browser
        const fileName = "responses";
        const json = JSON.stringify(allResponse, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);

        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }
  return (
    <Wrapper>
        <Loader isLoading={loading}>
            <div className="action-buttons">
                <Button variant="contained" color="secondary">
                    <CSVLink data={csvData}>Generate CSV</CSVLink>
                </Button>
                <Button variant="contained" color="secondary" onClick={handleJSONFileDownload}>
                    Generate JSON
                </Button>
            </div>
            
            
            <ResponsesTable data={tableData} />
        </Loader>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-bottom: 20px;
    }
`

export default AllResponses