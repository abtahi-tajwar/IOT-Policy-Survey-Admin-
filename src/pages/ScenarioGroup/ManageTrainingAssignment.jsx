import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Scenario from "../../firebase/scenarios";
import ScenarioGroups from "../../firebase/scenario_groups";
import styled from "@emotion/styled";
import Loader from "../../components/Loader";
import { useState, useEffect } from "react";
import Training from "../../firebase/Training";

function ManageTrainingAssignment({ groupId, open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = React.useState(false);
  const scene_groups = new ScenarioGroups();
  const training = new Training();
  const [assignedTraining, setAssignedTraining] = useState(null);
  const [unassignedTrainings, setUnassignedTrainings] = useState([]);

  useEffect(() => {
    if (groupId) {
        setLoading(true);
        initializeData().then((res) => {
          setLoading(false);
        }).catch(error => {
            console.log("Error Initializing Manage Training Assignment Data", error)
        });
    }
  }, [groupId]);

  const initializeData = () => {
    if (groupId) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Scenario Group Get By Id", groupId)
                const sceneGroupRes = (await scene_groups.getById(groupId)).response;
                let _unassignedTrainings = []
                let trainingResponse = null
                if (sceneGroupRes.data.trainingId) {
                  trainingResponse = (await training.getById(sceneGroupRes.data.trainingId)).response;
                  console.log("Assigned The Trainings", trainingResponse)
                  setAssignedTraining(trainingResponse);
                  const allTrainingResponse = (await training.getAll()).response;
                  if (trainingResponse) {  
                    _unassignedTrainings = allTrainingResponse.filter(
                        (atp) => atp.id !== trainingResponse.id
                    );
                  } else {
                    _unassignedTrainings = allTrainingResponse
                  }
                } else {
                  const allTrainingResponse = (await training.getAll()).response;
                  _unassignedTrainings = allTrainingResponse
                  setAssignedTraining(null);
                }
                setUnassignedTrainings(_unassignedTrainings);
                resolve({ trainingResponse, unassignedTrainings: _unassignedTrainings })
            } catch (error) {
                reject(error)
            }
          
        });
    } else {
        return Promise.reject({ error: 'Group Id Is Null '})
    }
  };

  useEffect(() => {
    console.log("Assigned Trainings", assignedTraining)
  }, [assignedTraining])

  const handleAssignTraining = (scenarioGroupId, trainingId) => {
    setLoading(true)
    scene_groups.assignTraining(scenarioGroupId, trainingId).then(res => {
      initializeData().then(res => {
        setLoading(false)
      })
    }).catch(e => {
      console.log("Failed to assign training", e)
    })
  }
  const handleUnassignTraining = (scenarioGroupId) => {
    setLoading(true)
    scene_groups.unassignTraining(scenarioGroupId).then(res => {
      initializeData().then(res => {
        setLoading(false)
      })
    }).catch(e => {
      console.log("Failed to unassign training", e)
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
            {assignedTraining && (
              <section>
                <div className="group">
                  <label className="group_label">Assigned Training</label>
                  <ul className="scene_list">
                    <li>
                      <div>
                        <span>{assignedTraining.data.name}</span> <br />
                        <span className="id_label">{assignedTraining.id}</span>
                      </div>
                      <Button variant="contained" size="small" color="error" onClick={() => handleUnassignTraining(groupId)}>
                        UnAssign
                      </Button>
                    </li>
                  </ul>
                </div>
              </section>
            )}
            <section>
              <div className="group">
                <label className="group_label">Scene Group Name</label>
                <ul className="scene_list">
                  {unassignedTrainings.map((ut) => (
                    <li>
                      <div>
                        <span>{ut.data.name}</span> <br />
                        <span className="id_label">{ut.id}</span>
                      </div>
                      <Button variant="contained" size="small" onClick={() => handleAssignTraining(groupId, ut.id)}>
                        Assign
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </ManageSceneGroupViewer>
        </Loader>
        <Button variant="contained" color="secondary" onClick={handleClose}>
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

export default ManageTrainingAssignment;
