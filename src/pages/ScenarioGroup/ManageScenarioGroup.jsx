import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Scenario from "../../firebase/scenarios";
import ScenarioGroups from "../../firebase/scenario_groups";
import styled from "@emotion/styled";
import Loader from "../../components/Loader";
import DNDListExtended from "../../components/DNDList/DNDListExtended";

function ManageScenarioGroup({ groupId, open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [scenes, setScenes] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [sceneGroups, setSceneGroups] = React.useState(null);
  const [sceneByGroup, setSceneByGroup] = React.useState();
  const [currentSceneGroup, setCurrentSceneGroup] = React.useState(null);
    /**
   * [{
   *  id: string,
   *  body: JSX,
   *  action: JSX
   * }]
   */
  const [assignedLessonsDnD, setAssignedLessonsDnD] = React.useState([])
  const scene = new Scenario();
  const scene_groups = new ScenarioGroups();

  React.useEffect(() => {
    scene.get().then((res) => {
      setScenes(res.response);
    });
    scene_groups.get().then((res) => {
      setSceneGroups(res.response);
    });
    // scene_groups.getById(groupId).then((res) => {
    //   setCurrentSceneGroup(res.response)
    // })
  }, [groupId]);

  React.useEffect(() => {
    if (scenes && sceneGroups) {
      const _sceneByGroup = {
        ungrouped: {
          name: "Ungrouped",
          id: "ungrouped",
          scenes: [],
        },
      };
      scenes.forEach((scene) => {
        if (!scene.data.groupId) {
          _sceneByGroup.ungrouped.scenes.push(scene);
        } else {
          const group = sceneGroups.find((sg) => sg.id === scene.data.groupId);
          if (!group) {
            _sceneByGroup.ungrouped.scenes.push(scene);
          } else {
            if (group.id in _sceneByGroup) {
              _sceneByGroup[group.id].scenes.push(scene);
            } else {
              _sceneByGroup[group.id] = {
                name: group.data.name,
                id: group.id,
                data: group.data,
                scenes: [scene],
              };
            }
          }
        }
      });

      setSceneByGroup(_sceneByGroup);
    }
  }, [scenes, sceneGroups]);

  React.useEffect(() => {
    setLoading(sceneByGroup ? false : true)
    if (sceneByGroup) {
      const currentSceneGroupName = Object.keys(sceneByGroup).find(sg_key => sceneByGroup[sg_key].id === groupId)
      if (currentSceneGroupName) {
        const currentSceneGroup = sceneByGroup[currentSceneGroupName]
        const orderedScenarioIds = currentSceneGroup.data.scenarios
        const orderedScenes = []
        orderedScenarioIds.map(osi => {
          const scene = currentSceneGroup.scenes.find(scene => scene.id === osi)
          if (scene) orderedScenes.push(scene)
        })
        setAssignedLessonsDnD(orderedScenes.map(scene => ({
          id: scene.id,
          body: (
            <div>
              <span>{scene.data.name}</span> <br />
              <span className="id_label">{scene.id}</span>
            </div>
          ),
          action: (
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() =>
                handleSceneGroupUnassign(scene.id)
              }
            >
              Unassign
            </Button>
          )
        })))
      }
    }
  }, [sceneByGroup])

  const handleSceneGroupAssign = (sceneId) => {
    // const body = {
    //   groupId,
    // };
    // scene.update(sceneId, body).then((res) => {
    //   setScenes(null);
    //   setSceneGroups(null);
    //   setSceneByGroup(null);
    //   scene.get().then((res) => {
    //     setScenes(res.response);
    //   });
    //   scene_groups.get().then((res) => {
    //     setSceneGroups(res.response);
    //   });
    // });
    setLoading(true)
    scene_groups.assignScene(groupId, sceneId).then((res) => {
      setScenes(null);
      setSceneGroups(null);
      setSceneByGroup(null);
      scene.get().then((res) => {
        setScenes(res.response);
      });
      scene_groups.get().then((res) => {
        setSceneGroups(res.response);
      });
    });
  };
  const handleSceneGroupUnassign = (sceneId) => {
    // const body = {
    //   groupId: "",
    // };
    // scene.update(sceneId, body).then((res) => {
    //   setScenes(null);
    //   setSceneGroups(null);
    //   setSceneByGroup(null);
    //   scene.get().then((res) => {
    //     setScenes(res.response);
    //   });
    //   scene_groups.get().then((res) => {
    //     setSceneGroups(res.response);
    //   });
    // });
    setLoading(true)
    scene_groups.unassignScene(groupId, sceneId).then((res) => {
      setScenes(null);
      setSceneGroups(null);
      setSceneByGroup(null);
      scene.get().then((res) => {
        setScenes(res.response);
      });
      scene_groups.get().then((res) => {
        setSceneGroups(res.response);
      });
    });
  };
  const updateAssignedScenesOrder = (groupId, assignedScenesDnD) => {
    const orderedScenes = assignedScenesDnD.map(asd => asd.id)
    setLoading(true);
    scene_groups.update(groupId, {
      scenarios: orderedScenes
    }).then(res => {
      setLoading(false)
    }).catch(e => {
      console.log("Failed to update scene ordering", e);
      setConfirmationPopup({
        show: true,
        error: true,
        text: "Failed to update scene ordering!",
      });
      setLoading(false);
    })
  }

  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Loader isLoading={loading}>
          <ManageSceneGroupViewer>
            <section>
              {sceneByGroup &&
                Object.keys(sceneByGroup).map(
                  (key) =>
                    sceneByGroup[key].id === groupId && (
                      <div className="group">
                        <label className="group_label">
                          {sceneByGroup[key].name}
                        </label>
                        <DNDListExtended 
                          cards={assignedLessonsDnD}
                          setCards={setAssignedLessonsDnD}
                        />
                        {/* <ul className="scene_list">
                          {sceneByGroup[key].scenes.map((scene) => (
                            <li>
                              <span>{scene.data.name}</span>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleSceneGroupUnassign(scene.id)
                                }
                              >
                                Unassign
                              </Button>
                            </li>
                          ))}
                        </ul> */}
                      </div>
                    )
                )}
            </section>
            <section>
              {sceneByGroup &&
                Object.keys(sceneByGroup).map(
                  (key) =>
                    sceneByGroup[key].id !== groupId && (
                      <div className="group">
                        <label className="group_label">
                          {sceneByGroup[key].name}
                        </label>
                        <ul className="scene_list">
                          {sceneByGroup[key].scenes.map((scene) => (
                            <li>
                              <span>{scene.data.name}</span>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleSceneGroupAssign(scene.id)}
                              >
                                Assign
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
            </section>
          </ManageSceneGroupViewer>
        </Loader>
        <Button variant="contained" color="secondary" onClick={() => updateAssignedScenesOrder(groupId, assignedLessonsDnD)}>
          Save Scene Order
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ mx: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 700,
  width: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ManageSceneGroupViewer = styled("div")`
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
`;

export default ManageScenarioGroup;
