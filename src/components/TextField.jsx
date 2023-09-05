import { useTheme } from "@emotion/react";
import {
  TextField as MTextField,
  InputLabel,
  FormControl,
  Box
} from "@mui/material";
import { forwardRef } from "react";

const TextField = forwardRef(({ children, ...props }, ref) => {
  return (
    <FormControl
      variant="outlined"
      sx={{
        width: "100%",
        ml: props.ml === "yes" ? 2 : "",
        mt: (props.mlabel === "" || !props.mlabel) ? 0 : 5.5
      }}
    >
      <InputLabel
        sx={{
          mt: -5,
          ml: "-12px",
          // -5.5*2=
        //   fontSize: "14px",
          color: "black",
          fontWeight: "bold"
        }}
      >
        {props.mlabel}

        <Box sx={{ display: "inline", color: "primary.main" }}>
          {props.isrequired === "yes" && "*"}
        </Box>
      </InputLabel>
      <MTextField
        autoComplete="none"
        autoCorrect="false"
        inputRef={ref}
        {...props}
      />
    </FormControl>
  );
});

export default TextField
