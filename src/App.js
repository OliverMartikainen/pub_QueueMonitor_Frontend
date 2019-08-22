import React, { useState } from 'react'
import AgentSection from './sections/AgentSection'
import QueueSection from './sections/QueueSection'
import OptionsSection from './sections/OptionsSection'
import TestLists from './tests/TestLists'
import './App.css'

/* for shits and giggles
const PlanButton = ({ setPlan }) => {
  return (
    <button onClick={setPlan}>Display/hide plan</button>
  )
}

const Plan = () => {
  return <img src="preliminaryLayout.jpg" alt="aa" width="900" heigth="900" />
}
*/

const BottomRight = ({team }) => {

  return (
    <div className="right-bottom">
      <h2>Team activated: {team}</h2>
    </div>
  )
}

const AgentFilter = (team, agents) => {
  if(!team) {
    return agents
  }
  return agents.filter(agent => agent.Team === team)
}

const App = () => {
  const [team, setTeam] = useState("")
  const [censor, setCensor] = useState(false)

  const AgentList = AgentFilter(team, TestLists.AgentsList)
  const QueueList = TestLists.QueueList
  const TeamList = TestLists.TeamList
  const ServiceList = TestLists.ServiceList

  return (
    <div>
      <QueueSection calls={QueueList} />

      <OptionsSection teams={TeamList} team={team} setTeam={setTeam} setCensor={() => setCensor(!censor)} censor={censor}/>

      <AgentSection agents={AgentList} />

      <BottomRight team={team}/>
    </div>
  );
}

export default App;
