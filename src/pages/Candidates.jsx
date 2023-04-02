import React from 'react'
import BasicTable from '../components/BasicTable'
import Candidate from '../firebase/Candidate'
import { IconButton } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

function Candidates() {
    const candidate = new Candidate();
    const [loading, setLoading] = React.useState(true)
    const [candidates, setCandidates] = React.useState([]);
    const [isLastPage, setIsLastPage] = React.useState(false);
    const [loadMoreLoading, setLoadMoreLoading] = React.useState(false);
    const [tableData, setTableData] = React.useState([]);

    React.useEffect(() => {
        setLoading(true)
        candidate.get().then(res => {
            setCandidates(res.response)
            updateTableData(res.response)
            setIsLastPage(res.isLastPage)
            setLoading(false)
        }) 
    }, [])

    const updateTableData = (candidates) => {
        setTableData(candidates.map(candidate => ({
            id: candidate.data.id,
            responses: candidate.data.responses
        })))
    }
    const loadMore = () => {
        setLoadMoreLoading(true)
        candidate.get(3).then(res => {
            setCandidates(res.response)
            updateTableData(res.response)
            setIsLastPage(res.isLastPage)
            setLoading(false)
            setLoadMoreLoading(false)
        }) 
    }

    const columns = [
        {
            id: "id",
            label: "ID",
            nameCol: true
        },
        {
            id: "responses",
            label: "Total Responses"
        },
        {
            id: "view",
            label: "View",
            render: (rowData) => <IconButton  LinkComponent={Link} to={`/candidate/responses/${rowData.id}`} color="primary" variant="contained">
                <RemoveRedEyeIcon />
            </IconButton>
        }
    ]
  return (
    <div>
        <Loader isLoading={loading}>
            <BasicTable 
                columns={columns}
                data={tableData}
                isLastPage={isLastPage}
                loadMoreLoading={loadMoreLoading}
                loadMore={loadMore}
            />
        </Loader>
    </div>
  )
}

export default Candidates