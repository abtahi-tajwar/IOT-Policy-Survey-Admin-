import React from "react";
import BasicTable from "../../components/BasicTable";
import Loader from "../../components/Loader";
import TrainingClass from "../../firebase/Training";
import {
  Grid,
  IconButton,
  Switch,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import Button from "../../components/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import AlertDialog from "../../components/AlertDialog";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Settings } from "@mui/icons-material";
import ManageTraining from "./ManageTraining";

function Training() {
  const training = new TrainingClass();
  const [trainingTableData, setTrainingTableData] = React.useState([]);
  const [trainings, setTrainings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isLastPage, setIsLastPage] = React.useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = React.useState(false);
  const [confirmationPopup, setConfirmationPopup] = React.useState({
    show: false,
    error: false,
    text: "",
  });
  const [currentDeleteScene, setCurrentDeleteScene] = React.useState(null);
  const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = React.useState(false);
  // Create training states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newTrainingName, setNewTrainingName] = React.useState("");
  const [createNewTrainingLoading, setCreateNewTrainingLoading] = React.useState(false);
  // Edit training states
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [editTraining, setEditTraining] = React.useState({
    id: null,
    name: null
  })
  const [editTrainingLoading, setEditTrainingLoading] = React.useState(false)
  const [manageTrainingOpen, setManageTrainingOpen] = React.useState(false)
  const [manageTrainingData, setManageTrainingData] = React.useState(null)
  const [manageTrainingDialog, setManageTrainingDialog] = React.useState({
    open: false,
    data: null
  })
  
  React.useEffect(() => {
    setLoading(true);
    training.get().then((res) => {
      setTrainings(res.response);
      updateTableRowData(res.response);
      setIsLastPage(res.isLastPage);
      setLoading(false);
    });
  }, []);
  React.useEffect(() => {
    updateTableRowData(trainings);
  }, [trainings]);

  const updateTableRowData = (trainingData) => {
    setTrainingTableData(
      trainingData.map((item) => ({
        id: item.id,
        name: item.data.name,
      }))
    );
  };
  const loadMore = () => {
    setLoadMoreLoading(true);
    training.get().then((res) => {
      setTrainings(res.response);
      updateTableRowData(res.response);
      setIsLastPage(res.isLastPage);
      setLoading(false);
      setLoadMoreLoading(false);
    });
  };

  const handleDeleteClick = (id) => {
    setCurrentDeleteScene(trainings.find((s) => s.id === id));
    setDeleteAlertDialogOpen(true);
  };
  const handleDelete = (response) => {
    if (response) {
      trainings.filter((s) => s.id !== currentDeleteScene.id);
      training
        .delete(currentDeleteScene.id)
        .then((res) => {
          training.getAll().then((res) => {
            setTrainings(res.response);
            updateTableRowData(res.response);
            setCreateNewTrainingLoading(false);
            setConfirmationPopup({
              show: true,
              error: false,
              text: `Scene ${currentDeleteScene.data.name} deleted successfully`,
            });
          });
          setConfirmationPopup({
            show: true,
            error: false,
            text: `Scene ${currentDeleteScene.data.name} deleted successfully`,
          });
        })
        .catch((e) => {
          setConfirmationPopup({
            show: true,
            error: true,
            text: `Failed to delete Scene ${currentDeleteScene.data.name}`,
          });
        });
    }
  };

  const handleCreateTraining = () => {
    setCreateNewTrainingLoading(true);
    training
      .create({
        name: newTrainingName,
        assignedGroupId: "",
      })
      .then(() => {
        training.getAll().then((res) => {
          setTrainings(res.response);
          updateTableRowData(res.response);
          setCreateNewTrainingLoading(false);
          setConfirmationPopup({
            show: true,
            error: false,
            text: `New Training Successfully Created`,
          });
        });
      })
      .catch((error) => {
        console.log("Failed to create new training", error);
        setConfirmationPopup({
          show: true,
          error: true,
          text: `Failed to create new training`,
        });
        setCreateNewTrainingLoading(false);
      });
  };

  const handleEditClick = (id, name) => {
    setEditTraining({
        id, name
    })
    setEditDialogOpen(true)
  }
  const handleEditTraining = () => {
    setEditTrainingLoading(true)
    training.update(editTraining.id, { name: editTraining.name }).then(() => {
        training.getAll().then((res) => {
            setTrainings(res.response);
            updateTableRowData(res.response);
            setEditTrainingLoading(false)
            setConfirmationPopup({
                show: true,
                error: false,
                text: `Updated Training ${editTraining.name}`,
            });
        }).catch(error => {
            console.log("Failed to edit training", error);
            setConfirmationPopup({
              show: true,
              error: true,
              text: `Failed to Update Training ${editTraining.name}`,
            });
            setEditTrainingLoading(false); 
        })
    })
  }

  const columns = [
    {
      id: "name",
      label: "Training name",
      nameCol: true,
    },
    {
      id: "includeLesson",
      label: "Include Lesson",
      render: (rowData) => (
        <Button 
          variant="contained" 
          startIcon={<Settings />}
          onClick={() => {
            setManageTrainingDialog({
              open: true,
              data: {
                id: rowData.id,
                name: rowData.name
              }
            })
          }}
        >
          Manage
        </Button>
      )
    },
    {
      id: "action",
      label: "Action",
      render: (rowData) => (
        <div className="action-container">
          <IconButton
            color="primary"
            LinkComponent={Link}
            onClick={() => handleEditClick(rowData.id, rowData.name)}
            // to={`/training/edit/${rowData.id}`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="danger"
            onClick={() => handleDeleteClick(rowData.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];
  return (
    <>
      <div>
        <Grid
          container
          justifyContent={"flex-end"}
          alignItems={"center"}
          sx={{ mb: 2 }}
        >
          <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
            Create
          </Button>
        </Grid>
        <Loader isLoading={loading}>
          <BasicTable
            columns={columns}
            data={trainingTableData}
            isLastPage={isLastPage}
            loadMoreLoading={loadMoreLoading}
            loadMore={loadMore}
          />
        </Loader>
      </div>
      <ConfirmationPopup data={confirmationPopup} />

      {currentDeleteScene && (
        <AlertDialog
          open={deleteAlertDialogOpen}
          setOpen={setDeleteAlertDialogOpen}
          title={"Deleting Scenario"}
          description={`Are you sure you want to delete scene ${currentDeleteScene.data.name}?`}
          onResponse={handleDelete}
        />
      )}
      {/* Dialog to create new training */}
      <Dialog
        open={createDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setCreateDialogOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent sx={{ width: "500px" }}>
          <Typography variant="h5">Create Training</Typography>
          <Typography variant="light">Create new training from here</Typography>
          <TextField
            id="filled-basic"
            label="Training Name"
            variant="filled"
            name="training_name"
            sx={{ width: "100%", my: 2 }}
            value={newTrainingName}
            onChange={(e) => setNewTrainingName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCreateTraining}
            loading={createNewTrainingLoading}
          >
            Create
          </Button>
          <Button onClick={() => setCreateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog to edit training */}
      <Dialog
        open={editDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setEditDialogOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent sx={{ width: "500px" }}>
          <Typography variant="h5">Create Training</Typography>
          <Typography variant="light">Create new training from here</Typography>
          <TextField
            id="filled-basic"
            label="Training Name"
            variant="filled"
            name="training_name"
            sx={{ width: "100%", my: 2 }}
            value={editTraining.name}
            onChange={(e) => setEditTraining({ ...editTraining, name: e.target.value} )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleEditTraining}
            loading={editTrainingLoading}
          >
            Update
          </Button>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ManageTraining 
        open={manageTrainingDialog.open}
        setOpen={(isOpen) => setManageTrainingDialog(prevState => ({ ...prevState, open: isOpen }))}
        trainingData={manageTrainingDialog.data}
      />
    </>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Training;
