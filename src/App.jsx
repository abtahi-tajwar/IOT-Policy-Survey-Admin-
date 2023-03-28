import { useState } from 'react'
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Sidenav from './components/Sidenav';
import IotLogo from './assets/iot.png';
import { BrowserRouter as Router } from 'react-router-dom';
import Response from './firebase/responses';
import Scenario from './firebase/scenarios';
import Routes from './Routes';


function App() {
  const [count, setCount] = useState(0)
  const response = new Response()
  const scenarios = new Scenario()
  response.get().then(res => console.log(res))
  response.count().then(count => console.log(count))
  scenarios.get().then(scene => console.log("Scene", scene))
  return (
    <Router>
      <div className="App">
        <Sidenav
          items={NavItems}
          logoSource={IotLogo}
        >
          <Routes />
        </Sidenav>
      </div>
    </Router>
  )
}

const NavItems = {
  firstItems: [
    {
      name: "dashbaord",
      label: "Dashboard",
      icon: <DashboardIcon />,
      url: "/"
    },
    {
      name: "scenarios",
      label: "Scenarios",
      icon: <PsychologyAltIcon />,
      url: "/scenarios"
    },
    {
      name: "catalog",
      label: "Catalog",
      icon: <ReplyAllIcon />,
      url: '/responses'
    }
  ]
};

export default App
