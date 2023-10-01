import { IconButton, Button, Box, Typography } from "@mui/material";
import React from "react";
import BasicTable from "../../components/BasicTable";
import BasicDialog from "../../components/BasicDialog";
import Lesson from "../../firebase/Lesson";
import Loader from "../../components/Loader";

function LessonResponsesTable({ data }) {
  const lesson = new Lesson();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [currentResponse, setCurrentResponse] = React.useState(null);
  const [currentLessonOfResponse, setCurrentLessonOfResponse] =
    React.useState(null);
  const [currentResponseLoading, setCurrentResponseLoading] =
    React.useState(false);
  const handleShowResponse = (data) => {
    setCurrentResponseLoading(true);
    setCurrentResponse(data);
    lesson.getById(data.lessonId).then((res) => {
      console.log("Got the lesson", res);
      setCurrentLessonOfResponse(res.response);
      setCurrentResponseLoading(false);
    });
    setDialogOpen(true);
  };
  const columns = [
    {
      id: "lessonId",
      label: "Lesson Id",
      nameCol: true,
    },
    {
      id: "lessonType",
      label: "Lesson Type",
    },
    {
      id: "score",
      label: "Obtained Score",
    },
    {
      id: "total",
      label: "Total Score",
    },
    {
      id: "elapsedTime",
      label: "Elapsed Time",
    },
    {
      id: "view",
      label: "View Responses",
      render: (rowData) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleShowResponse(rowData)}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <BasicTable columns={columns} data={data} />
      <BasicDialog open={dialogOpen} setOpen={setDialogOpen}>
        <Loader isLoading={currentResponseLoading}>
          {currentLessonOfResponse && (
            <>
              {currentResponse.lessonType === "mcq" &&
                currentLessonOfResponse.data.questions.map(
                  (questionData, qdi) => (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="p">
                        <b>
                          {qdi + 1}. {questionData.question}
                        </b>
                      </Typography>
                      <br />
                      <Typography variant="p">
                        <i>Options: </i> {questionData.options.join(", ")}
                      </Typography>
                      <br />
                      <Typography variant="p">
                        <i>User Response: </i>{" "}
                        {questionData.options[currentResponse.responses[qdi]]}
                      </Typography>
                      <br />
                      <Typography variant="p">
                        <i>Correct Response: </i>{" "}
                        {questionData.options[questionData.answer.index]}
                      </Typography>
                    </Box>
                  )
                )}
              {currentResponse.lessonType === "dnd" &&
                currentLessonOfResponse.data.blanks.map((blankData, bdi) => (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="p">
                      <b>
                        {bdi + 1}.{" "}
                        {blankData.question
                          .map((part) => (part === "{{blank}}" ? "____" : part))
                          .join(" ")}
                      </b>
                    </Typography>
                    <br />
                    <Typography variant="p">
                      <i>User Responses: </i>{" "}
                      {currentResponse.responses[bdi]["_"]
                        .map((p) => p.answer)
                        .join(", ")}
                    </Typography>
                    <br />
                    <Typography variant="p">
                      <i>Correct Answers: </i> {blankData.answers.join(", ")}
                    </Typography>
                  </Box>
                ))}
              {currentResponse.lessonType === "demographics" &&
                currentLessonOfResponse.data.questions.map(
                  (questionData, qdi) => (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="p">
                        <b>
                          {qdi + 1}. {questionData.question}
                        </b>
                      </Typography>
                      <br />
                      <Typography variant="p">
                        <i>Options: </i> {questionData.options.join(", ")}
                      </Typography>
                      <br />
                      <Typography variant="p">
                        <i>User Response: </i>{" "}
                        {questionData.options[currentResponse.responses[qdi]]}
                      </Typography>
                    </Box>
                  )
                )}
              {currentResponse.lessonType === "attention_check" &&
                currentLessonOfResponse.data.questions.map(
                  (questionData, qdi) => (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="p">
                        <b>
                          {qdi + 1}. {questionData.question}
                        </b>
                      </Typography>
                      <br />
                      <Typography variant="p">
                        <i>User Response: </i>{" "}
                        {currentResponse.responses[qdi]}
                      </Typography>
                    </Box>
                  )
                )}
            </>
          )}
        </Loader>
      </BasicDialog>
    </>
  );
}

export default LessonResponsesTable;
