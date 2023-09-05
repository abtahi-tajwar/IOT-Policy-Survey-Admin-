import { useState } from "react";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Sidenav from "./components/Sidenav";
import IotLogo from "./assets/iot.png";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CollectionsIcon from "@mui/icons-material/Collections";
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import SchoolIcon from '@mui/icons-material/School';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import SignIn from "./pages/SignIn";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <Sidenav items={NavItems} logoSource={IotLogo}>
            <Routes />
          </Sidenav>
        ) : (
          <SignIn setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </Router>
  );
}

const NavItems = {
  firstItems: [
    {
      name: "dashbaord",
      label: "Dashboard",
      icon: <DashboardIcon />,
      url: "/",
    },
    {
      name: "scenarios",
      label: "Scenarios",
      icon: <PsychologyAltIcon />,
      subItems: [
        {
          name: "all_scenarios",
          label: "View All",
          url: "/scenario/all",
          headingLabel: "All Scenarios",
        },
        {
          name: "create_scenario",
          label: "Create New",
          url: "/scenario/create",
          headingLabel: "Create New Scenario",
        },
      ],
    },
    {
      name: "scenario_groups",
      label: "Scenario Groups",
      icon: <GroupWorkIcon />,
      subItems: [
        {
          name: "all_scenario_groups",
          label: "View All",
          url: "/scenario_group/all",
          headingLabel: "All Scenarios",
        },
        {
          name: "create_scenario",
          label: "Create New",
          url: "/scenario_group/create",
          headingLabel: "Create New Scenario",
        },
      ],
    },
    {
      name: "candidates",
      label: "Candidates",
      icon: <PeopleAltIcon />,
      url: "/candidates",
    },
    {
      name: "responses",
      label: "Responses",
      icon: <ReplyAllIcon />,
      url: "/responses",
    },
    {
      name: 'training',
      label: "Training",
      icon: <SchoolIcon />,
      subItems: [
        {
          name: "manage_training",
          label: "Manage Training",
          url: "/training",
          headingLabel: "Manage Training",
        },
        {
          name: "view_lessons",
          label: "View Lessons",
          url: "/lesson/all",
          headingLabel: "All Lessons",
        },
        {
          name: "create_lesson",
          label: "Create Lesson",
          url: "/lesson/create",
          headingLabel: "Create Lesson",
        }
      ]
    },
    {
      name: "gallery",
      label: "Gallery",
      icon: <CollectionsIcon />,
      url: "/gallery",
    },
  ],
};

export default App;
