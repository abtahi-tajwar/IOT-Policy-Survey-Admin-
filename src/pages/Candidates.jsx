import React from 'react'
import BasicTable from '../components/BasicTable'
import Candidate from '../firebase/Candidate'
import ScenarioGroups from '../firebase/scenario_groups';
import { IconButton, MenuItem } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import Select from '@mui/material/Select';
import { where } from 'firebase/firestore';


function Candidates() {
    const candidate = new Candidate();
    const scenarioGroup = new ScenarioGroups();
    const [loading, setLoading] = React.useState(true)
    const [candidates, setCandidates] = React.useState([]);
    const [scenarioGroups, setScenarioGroups] = React.useState([])
    const [isLastPage, setIsLastPage] = React.useState(false);
    const [loadMoreLoading, setLoadMoreLoading] = React.useState(false);
    const [tableData, setTableData] = React.useState([]);
    const [scenarioGroupOptions, setScenarioGroupOptions] = React.useState([])
    const [selectedScenarioGroup, setSelectedScenarioGroup] = React.useState("all")

    React.useEffect(() => {
        setLoading(true)
        scenarioGroup.get().then(scenarioGroupRes => {
            updateScenarioGroupSelect(scenarioGroupRes.response)
            if (selectedScenarioGroup === 'all') {
                candidate.get().then(res => {
                    setCandidates(res.response)
                    updateTableData(res.response, scenarioGroupRes.response)
                    setIsLastPage(res.isLastPage)
                    setLoading(false)
                }) 
            } else {
                candidate.get(10, [where('assignedGroup', '==', selectedScenarioGroup)]).then(res => {
                    setCandidates(res.response)
                    updateTableData(res.response, scenarioGroupRes.response)
                    setIsLastPage(res.isLastPage)
                    setLoading(false)
                }) 
            }
        })
    }, [selectedScenarioGroup])


    const updateTableData = (candidates, scenarioGroups) => {
        setTableData(candidates.map(candidate => ({
            id: candidate.id,
            responses: candidate.data.responses,
            scenarioGroup: scenarioGroups.find(sg => sg.id === candidate.data.assignedGroup)?.data.name ?? "No Group Was Assigned"
        })))
    }
    const updateScenarioGroupSelect = (scenarioGroups) => {
        const _data = []
        scenarioGroups.forEach(item => {
            _data.push({
                value: item.id,
                label: item.data.name
            })
        })
        setScenarioGroupOptions(_data)
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

    const handleScenarioGroupChange = (e) => {
        setSelectedScenarioGroup(e.target.value)
    }

    const columns = [
        {
            id: "id",
            label: "ID",
            nameCol: true
        },
        {
            id: "scenarioGroup",
            label: "Scenario Group"
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
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedScenarioGroup}
            label="Age"
            onChange={handleScenarioGroupChange}
            sx={{
                width: '500px',
                mb: 2
            }}
        >
            <MenuItem value="all">All Scenario Groups</MenuItem>
            {scenarioGroupOptions.map(option => (
                <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
            ))}
        </Select>
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