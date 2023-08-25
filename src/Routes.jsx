import React from 'react'
import { Routes as Switch, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CreateScenario from './pages/Scenario/CreateScenario'
import AllScenarios from './pages/Scenario/AllScenarios'
import EditScenario from './pages/Scenario/EditScenario'
import AllResponses from './pages/Responses/AllResponses'
import AllScenarioGroups from './pages/ScenarioGroup/AllScenarioGroups'
import CreateScenarioGroup from './pages/ScenarioGroup/CreateScenarioGroup'
import Candidates from './pages/Candidates'
import CandidateResponses from './pages/Responses/CandidateResponses'
import Gallery from './pages/Gallery/Gallery'
import Training from './pages/Training/Training'

function Routes() {
  return (
    <Switch>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scenario/create" element={<CreateScenario />} />
        <Route path="/scenario/all" element={<AllScenarios />} />
        <Route path="/scenario/edit/:id" element={<EditScenario />} />
        <Route path="/scenario_group/all" element={<AllScenarioGroups />} />
        <Route path="/scenario_group/create" element={<CreateScenarioGroup />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/responses" element={<AllResponses />} />
        <Route path="/candidate/responses/:id" element={<CandidateResponses />} />
        <Route path="/training" element={<Training />} />
        <Route path="/gallery" element={<Gallery />} />
    </Switch>
  )
}

export default Routes