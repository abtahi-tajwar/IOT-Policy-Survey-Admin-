import { Box, Typography } from "@mui/material";
import TextField from "./TextField";
// import { ReactComponent as Cross } from "../../assets/cross-secondary.svg";
import Cross from '@mui/icons-material/Close';
import { useRef } from "react";
const ListInput = ({ ml, mlabel, setArr, arr }) => {
  const ipRef = useRef(null);
  const handleRemove = el => {
    setArr(arr.filter(el1 => el1 !== el));
  };
  return (
    <Box>
      <TextField
        ref={ipRef}
        placeholder="Enter"
        mlabel={mlabel}
        type="text"
        ml={ml}
        onKeyUp={e => {
          if (e.key === "Enter" && e.target.value?.trim() !== "") {
            e.stopPropagation();

            let x = arr?.find(entry => {
              return e.target.value.trim() === entry;
            });

            // indexOf(x)
            if (!x?.length > 0) {
              let m = e.target.value.trim();
              setArr(arr.concat(m));
            }
            ipRef.current.value = "";
          }
        }}
      />
      {arr?.length > 0 && (
        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexFlow: "wrap"
          }}
        >
          {arr?.map((el, i) => {
            return (
              <Box
                sx={{
                  padding: "9px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(139, 132, 155, 0.1)",
                  borderRadius: "5px",
                  margin: "0 12px 12px 0"
                }}
                key={i}
              >
                <Typography variant="h6" sx={{ color: "customThemeColor.secondary" }}>
                  {el}
                </Typography>
                <Cross
                  style={{ cursor: "pointer", marginLeft: "14px" }}
                  onClick={() => {
                    handleRemove(el);
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ListInput
