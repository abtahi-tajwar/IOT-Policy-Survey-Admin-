import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabNavigator({ tabs, currentTab, setCurrentTab }) {
  const [value, setValue] = React.useState(currentTab ? tabs.findIndex(t => t.value === currentTab) : 0);

  const handleChange = (event, newValue) => {
    console.log("Tab Value updated itself", value)
    setValue(newValue);
    if (setCurrentTab) setCurrentTab(tabs[newValue].value)
  };

//   React.useEffect(() => {
//     if (currentTab) {
//         const _index = tabs.findIndex(t => t.value === currentTab)
//         console.log("Current Tab should be", _index, tabs[_index].value)
//         setValue(_index)
//     }
//   }, [currentTab])

  React.useEffect(() => {
    console.log("Current tab numerical value", value)
  }, [value])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {tabs.map((tab, ti) => <Tab key={tab.value} label={tab.label} {...a11yProps(ti)} /> )}
        </Tabs>
      </Box>
      {tabs.map((tab, ti) => (
        <CustomTabPanel key={tab.value} value={value} index={ti}>
            {tab.body}
        </CustomTabPanel>
      ))}
    </Box>
  );
}