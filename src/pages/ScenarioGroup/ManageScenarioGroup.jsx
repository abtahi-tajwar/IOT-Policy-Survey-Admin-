import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Scenario from '../../firebase/scenarios';
import ScenarioGroups from '../../firebase/scenario_groups';
import styled from '@emotion/styled';


function ManageScenarioGroup({ groupId, open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [scenes, setScenes] = React.useState(null)
  const [sceneGroups, setSceneGroups] = React.useState(null)
  const [sceneByGroup, setSceneByGroup] = React.useState()
  const scene = new Scenario()
  const scene_groups = new ScenarioGroups()

  React.useEffect(() => {
    scene.get().then(res => {
        setScenes(res.response)
    })
    scene_groups.get().then(res => {
        setSceneGroups(res.response)
    })
  }, [groupId])

  React.useEffect(() => {
    if (scenes && sceneGroups) {
        const _sceneByGroup = {
            ungrouped: {
                name: "Ungrouped",
                id: null,
                scenes: []
            }
        }
        scenes.forEach(scene => {
            if (!scene.data.groupId) {
                _sceneByGroup.ungrouped.scenes.push(scene)
            } else {
                const group = sceneGroups.find(sg => sg.id === scene.data.groupId)
                if (!group) {
                    _sceneByGroup.ungrouped.scenes.push(scene)
                } else {
                    if (group.id in _sceneByGroup) {
                        _sceneByGroup[group.id].scenes.push(scene)
                    } else {
                        _sceneByGroup[group.id] = {
                            name: group.data.name,
                            id: group.id,
                            scenes: [scene]
                        }
                    }
                }
            }
        })

        setSceneByGroup(_sceneByGroup)
    }
  }, [scenes, sceneGroups])

  React.useEffect(() => {
    console.log("Scene by group", sceneByGroup)
  }, [sceneByGroup])


  return (
    <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <ManageSceneGroupViewer>

            </ManageSceneGroupViewer>
          <Button variant='contained' color="secondary" onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
  )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 700,
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const ManageSceneGroupViewer = styled('div')`
    width: 95%;
    margin: 0 auto;
    height: 70vh;
`

export default ManageScenarioGroup