import React from 'react'
import BasicTable from '../../components/BasicTable'
import Loader from '../../components/Loader'
import Scenario from '../../firebase/scenarios'
import { Button, IconButton, Switch } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom'
import ConfirmationPopup from '../../components/ConfirmationPopup'
import AlertDialog from '../../components/AlertDialog'
import ScenarioGroups from '../../firebase/scenario_groups'
import ManageScenarioGroup from './ManageScenarioGroup'

function AllScenarioGroups() {
    const scenario_group = new ScenarioGroups()
    const [scenesTableData, setScenesTableData] = React.useState([])
    const [scenes, setScenes] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [isLastPage, setIsLastPage] = React.useState(false);
    const [loadMoreLoading, setLoadMoreLoading] = React.useState(false);
    const [confirmationPopup, setConfirmationPopup] = React.useState({
        show: false,
        error: false,
        text: ""
    })
    const [currentDeleteScene, setCurrentDeleteScene] = React.useState(null)
    const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = React.useState(false)
    const [openManage, setOpenManage] = React.useState(false)
    const [manageSceneGroupId, setManageSceneGroupId] = React.useState(null)
    React.useEffect(() => {
        setLoading(true)
        scenario_group.get().then((res) => {
            setScenes(res.response)
            updateTableRowData(res.response)
            setIsLastPage(res.isLastPage)
            setLoading(false)
        })
    }, [])
    React.useEffect(() => {
        updateTableRowData(scenes)
    }, [scenes])

    const updateTableRowData = (sceneData) => {
        setScenesTableData(sceneData.map(item => ({
            id: item.id,
            name: item.data.name,
            active: item.data.active,
            totalAssignedUsers: item.data.totalAssignedUsers,
            totalScenes: item.data.scenarios ? item.data.scenarios.length : 0
        })))
    }
    const loadMore = () => {
        setLoadMoreLoading(true)
        scenario_group.get().then((res) => {
            setScenes(res.response)
            updateTableRowData(res.response)
            setIsLastPage(res.isLastPage)
            setLoading(false)
            setLoadMoreLoading(false)
        })
    }
    const handleScenarioStatusChange = (id, active) => {
        let _updatedScene = null
        setScenes(scenes.map(scene => {
            if (scene.id === id) {
                _updatedScene = {
                    name: scene.data.name,
                    instruction_markdown: scene.data.instruction_markdown,
                    scenario_markdown: scene.data.scenario_markdown,
                    active: !active,
                    order: scene.data.order
                }
                console.log("Updated Scene", _updatedScene)
                return {
                    ...scene,
                    data: {
                        ...scene.data,
                        active: !active
                    }
                }
            }
            return scene
        }))
        scenario_group.update(id, _updatedScene).then(res => {
            setConfirmationPopup({
                show: true,
                error: false,
                text: `Scene ${_updatedScene.name} is ${_updatedScene.active ? 'activated' : 'deactivated'}`
            })
        }).catch(e => {
            setConfirmationPopup({
                show: true,
                error: false,
                text: `Scene ${_updatedScene.name} cannot be ${_updatedScene.active ? 'activated' : 'deactivated'}`
            })
        })
    }

    const handleDeleteClick = (id) => {
        setCurrentDeleteScene(scenes.find(s => s.id === id))
        setDeleteAlertDialogOpen(true)
    }
    const handleDelete = (response) => {
        if (response) {
            setScenes(scenes.filter(s => s.id !== currentDeleteScene.id))
            scenario_group.delete(currentDeleteScene).then(res => {
                setConfirmationPopup({
                    show: true,
                    error: false,
                    text: `Scene ${currentDeleteScene.data.name} deleted successfully`
                })
            }).catch(e => {
                setConfirmationPopup({
                    show: true,
                    error: false,
                    text: `Failed to delete Scene ${currentDeleteScene.data.name}`
                })
            })
        }
    }
    const handleOpenSceneGroupManager = (id) => {
        setManageSceneGroupId(id)
        setOpenManage(true)
    }
    const columns = [
        {
            id: "name",
            label: "Scenario Group name",
            nameCol: true
        },
        {
            id: "totalAssignedUsers",
            label: "Total Assigned User"
        },
        {
            id: "totalScenes",
            label: "Total Scenes"
        },
        {
            id: "active",
            label: "Active",
            render: (rowData) => (
                <Switch 
                    checked={rowData.active} 
                    onChange={() => handleScenarioStatusChange(rowData.id, rowData.active)}
                />
            )
        },
        {
            id: "assignScene",
            label: "Assign Scene",
            render: (rowData) => (
                <Button 
                    onClick={() => handleOpenSceneGroupManager(rowData.id)}
                    variant='contained' color="secondary" startIcon={<SettingsIcon />}
                >Manage
                </Button>
            )
        },
        {
            id: 'action',
            label: "Action",
            render: (rowData) => (
                <div className="action-container">
                    <IconButton color="primary" LinkComponent={Link} to={`/scenario_group/edit/${rowData.id}`}><EditIcon /></IconButton>
                    <IconButton color="danger" onClick={() => handleDeleteClick(rowData.id)}><DeleteIcon /></IconButton>
                </div>
            )
        }
    ]
  return (
    <>
        <div>
            <Loader isLoading={loading}>
                <BasicTable 
                    columns={columns}
                    data={scenesTableData}
                    isLastPage={isLastPage}
                    loadMoreLoading={loadMoreLoading}
                    loadMore={loadMore}
                />
            </Loader>
        </div>
        <ConfirmationPopup data={confirmationPopup} />
        
        {currentDeleteScene && <AlertDialog 
            open={deleteAlertDialogOpen}
            setOpen={setDeleteAlertDialogOpen}
            title={"Deleting Scenario"}
            description={`Are you sure you want to delete scene ${currentDeleteScene.data.name}?`}
            onResponse={handleDelete}
        />}
        {openManage && <ManageScenarioGroup 
            open={openManage}
            setOpen={setOpenManage}
            groupId={manageSceneGroupId}
        />}
    </>
  )
}

export default AllScenarioGroups