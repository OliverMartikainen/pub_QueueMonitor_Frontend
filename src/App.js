import React, { useState, useEffect } from 'react'
import AgentSection from './sections/AgentSection'
import QueueSection from './sections/QueueSection'
import OptionsSection from './sections/OptionsSection'
import dataService from './services/dataService'
import './App.css'

//add later cookie to save previous team & profile?

const BottomRight = ({ team }) => <div className="right-bottom"><h2>Team activated: {team}</h2></div>

const AgentFilter = (team, agents) => !team ? agents : agents.filter(agent => agent.Team === team)

const QueueFilter = (queue, queueProfile) => {
  const ServiceIds = queueProfile.ServiceIds
  if (!ServiceIds || ServiceIds.length === 0) {
    return queue //chooses default queue view
  }
  return queue.filter(item => ServiceIds.includes(item.ServiceId))
}

const App = () => {
  const [team, setTeam] = useState("") //active team
  const [censor, setCensor] = useState(false) //if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //list of teams and their chosen services
  const [queueProfile, setQueueProfile] = useState({}) //need to be GET only once

  useEffect(() => { 
    //Teams updated every 1h in backend - atm need refresh in frontend
    //Teams = [{ TeamName, Profiles[{ TeamName, AgentId, AgentName, ServiceIds }] }]
    dataService.getTeams().then(response => response ? setTeams(response) : console.log('GetTeams failed', response))
    dataService.getAgents().then(response => setAgents(response))
    dataService.getQueue().then(response => setQueue(response))

    setInterval(() => { 
      dataService.getAgents().then(response => setAgents(response))
      dataService.getQueue().then(response => setQueue(response))
    }, 4000)
  }, [])

  //want these to happen on each re-render? in theory wouldnt need to (eg no change).
  const AgentsFiltered = AgentFilter(team, agents) //filters agent section - only selected teams agents shown
  const QueueFiltered = QueueFilter(queue, queueProfile)

  //team, teams, setTeam, queueProfile, setQueueProfile, censor, setCensor(!censor)
  const OptionsItems = {
    team: team, //to highlight chosen team
    teams: teams, //all teams & profiles
    setTeam: setTeam, //for change team button
    queueProfile: queueProfile, //highlight chosen profile
    setQueueProfile: setQueueProfile, //profiles button func
    censor: censor, //show current status
    setCensor: (() => setCensor(!censor)), //censor button func
  }

  //div child item orders matter!
  return (
    <div className="main">
      <QueueSection queue={QueueFiltered} /> 
      <AgentSection agents={AgentsFiltered} />
      <OptionsSection OptItems={OptionsItems} />
      <BottomRight team={team}/>
    </div>
  );
}

export default App;
