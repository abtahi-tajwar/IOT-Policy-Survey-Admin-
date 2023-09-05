import { createTheme } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
      primary: {
        main: "#FFA382",
        hover: "#ff7c4c"
      },
      secondary: {
        main: "#061049",
        lightBlue: "#F4F7FD"
      },
      gray: {
        main: "#E2E8F0",
        dark: "#747474",
        extraDark: '#192746',
        light: "#F8FAFC",
        disabled: "#f2f2f2"
      },
      danger: {
        main: "#FF6D6D",
      },
      action: {
        danger: "#FF6D6D"
      }
    },
    typography: {
      light: {
        color: blueGrey[600]
      }
    },
    components: {
        MuiButton: {
          variants: [
            {
              props: { variant: 'contained' },
              style: {
                color: 'white',
              },
            },
            {
              props: { variant: 'gray-contained' },
              style: {
                backgroundColor: '#E2E8F0',
                color: '#747474',
              },
            },
          ],
        },
    },
    
});