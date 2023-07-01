import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Scenario from '../../firebase/scenarios';
import ScenarioGroups from '../../firebase/scenario_groups';
import styled from '@emotion/styled';
import Loader from '../../components/Loader'


function ManageScenarioGroup({ groupId, open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [scenes, setScenes] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
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
                id: "ungrouped",
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

  const handleSceneGroupAssign = (sceneId) => {
    const body = {
      groupId
    }
    scene.update(sceneId, body).then(res => {
      setScenes(null)
      setSceneGroups(null)
      setSceneByGroup(null)
      scene.get().then(res => {
          setScenes(res.response)
      })
      scene_groups.get().then(res => {
          setSceneGroups(res.response)
      })
    })
  }

  React.useEffect(() => {
    console.log("Scene by group", sceneByGroup, scenes, sceneGroups)
  }, [sceneByGroup])


  return (
    <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Loader isLoading={sceneByGroup ? false : true}>
            <ManageSceneGroupViewer>
            <section>
                {sceneByGroup && Object.keys(sceneByGroup).map(key => 
                  sceneByGroup[key].id === groupId && <div className='group'>
                    {console.log("Scene groups loading section", sceneByGroup[key].id, groupId)}
                    <label className='group_label'>{sceneByGroup[key].name}</label>
                    <ul className='scene_list'>
                      {
                        sceneByGroup[key].scenes.map(scene => 
                          <li>
                            <span>{scene.data.name}</span>
                          </li>
                        )
                      }
                    </ul>
                  </div>
                )}
              </section>
              <section>
                {sceneByGroup && Object.keys(sceneByGroup).map(key => 
                  sceneByGroup[key].id !== groupId && <div className='group'>
                    {console.log("Scene groups loading section", sceneByGroup[key].id, groupId)}
                    <label className='group_label'>{sceneByGroup[key].name}</label>
                    <ul className='scene_list'>
                      {
                        sceneByGroup[key].scenes.map(scene => 
                          <li>
                            <span>{scene.data.name}</span>
                            <Button variant='contained' size='small' onClick={() => handleSceneGroupAssign(scene.id)}>Assign</Button>
                          </li>
                        )
                      }
                    </ul>
                  </div>
                )}
              </section>
            </ManageSceneGroupViewer>
          </Loader>
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
    margin: 20px auto;
    height: 70vh;
    overflow-y: scroll;
    section {
      .group_label {
        font-size: 1.5rem;
        font-weight: bold;
        border-bottom: 0.1px solid black;
      }
      .scene_list {
        list-style-type: none;
        padding: 0;
        li {
          padding: 5px;
          border-radius: 5px;
          margin: 5px 0px;
          box-shadow: 0px 0px 5px 0px rgba(205, 205, 205, 0.75);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
`

export default ManageScenarioGroup