import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Scenario from "../../firebase/scenarios";
import ScenarioGroups from "../../firebase/scenario_groups";
import styled from "@emotion/styled";
import Loader from "../../components/Loader";
import Lesson from "../../firebase/Lesson";
import Training from "../../firebase/Training";
import ConfirmationPopup from "../../components/ConfirmationPopup";

function ManageTraining({ open, setOpen, trainingData }) {
  const lesson = new Lesson();
  const training = new Training();
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = React.useState(true);
  const [unincludedLessons, setUnincludedLessons] = React.useState([]);
  const [includededLessons, setIncludedLessons] = React.useState([]);
  const [confirmationPopup, setConfirmationPopup] = React.useState({
    show: false,
    error: false,
    text: "",
  });

  React.useEffect(() => {
    initializeLessonData(trainingData);
  }, [trainingData]);

  const initializeLessonData = (trainingData) => {
    if (trainingData) {
      setLoading(true);
      training.getById(trainingData.id).then((trainingRes) => {
        lesson.getAll().then((lessonsRes) => {
          const includedLessons = trainingRes.response.data.lessons;
          console.log("Lessons response", lessonsRes);
          console.log("Training Response", trainingRes)
          let _unincludedLessons = [];
          let _includedLessons = [];
          if (includedLessons) {
            lessonsRes.response.forEach((ls) => {
              if (!includedLessons.some((item) => item.id === ls.id)) {
                _unincludedLessons.push(ls);
              } else {
                _includedLessons.push(ls);
              }
            });
          } else {
            _unincludedLessons = lessonsRes.response
          }
          setUnincludedLessons(_unincludedLessons);
          setIncludedLessons(_includedLessons);
          setLoading(false);
        });
      });
    }
  };

  const handleIncludeLesson = (trainingId, lessonId, trainingName) => {
    setLoading(true);
    training
      .includeLesson(trainingId, lessonId, trainingName)
      .then(() => {
        initializeLessonData(trainingData);
      })
      .catch((e) => {
        console.log("Unable to assign lesson", e);
        setConfirmationPopup({
          show: true,
          error: true,
          text: "Unable to include the lesson, something went wrong!",
        });
      });
  };
  const handleUnincludeLesson = (trainingId, lessonId, trainingName) => {
    setLoading(true);
    training
      .unincludeLesson(trainingId, lessonId, trainingName)
      .then(() => {
        initializeLessonData(trainingData);
      })
      .catch((e) => {
        console.log("Unable to assign lesson", e);
        setConfirmationPopup({
          show: true,
          error: true,
          text: "Unable to uninclude the lesson, something went wrong!",
        });
      });
  };

  return (
    <>
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
                <div className="group">
                  <label className="group_label">Included Lessons</label>
                  <ul className="scene_list">
                    {includededLessons.map((ls) => (
                      <li>
                        <div>
                          <span>{ls.data.name}</span> <br />
                          <span className="id_label">{ls.id}</span>
                        </div>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() =>
                            handleUnincludeLesson(
                              trainingData.id,
                              ls.id,
                              trainingData.name
                            )
                          }
                        >
                          Uninclude
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
              <section>
                <div className="group">
                  <label className="group_label">
                    Lessons Not Included In This Training
                  </label>
                  <ul className="scene_list">
                    {unincludedLessons.map((ls) => (
                      <li key={ls.id}>
                        <div>
                          <span>{ls.data.name}</span> <br />
                          <span className="id_label">{ls.id}</span>
                        </div>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleIncludeLesson(
                              trainingData.id,
                              ls.id,
                              trainingData.name
                            )
                          }
                        >
                          Include
                        </Button>
                      </li>
                    ))}
                    {/* <li>
                    <span>Scene Data Name</span>
                    <Button variant="contained" size="small">
                      Assign
                    </Button>
                  </li> */}
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
      <ConfirmationPopup data={confirmationPopup} />
    </>
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
        .id_label {
          font-size: 0.7rem;
          color: #404040;
        }
      }
    }
  }
`;

export default ManageTraining;
