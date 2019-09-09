import React, { useState, useEffect } from 'react'
import AgentSection from './sections/AgentSection'
import QueueSection from './sections/QueueSection'
import OptionsSection from './sections/OptionsSection'
import dataService from './services/dataService'
import Censor from './utils/Censor'
import './App.css'

//add later cookie to save previous team & profile?

const BottomRight = ({ team }) => <div className="right-bottom"><h2>Team activated: {team}</h2></div>

const AgentFormatter = (team, agents, censor) => {
  if (!agents || agents.length === 0) {
    return []
  }
  const AgentFilter = (team, agents) => !team ? agents : agents.filter(agent => agent.Team === team)

  const AgentsFiltered = AgentFilter(team, agents)
  const AgentsSorted = AgentsFiltered.sort((a1, a2) => (a1.AgentName < a2.AgentName ? -1 : 1))
  return censor ? Censor(AgentsSorted) : AgentsSorted
}

const QueueFormatter = (queue, queueProfile, censor) => {
  const QueueFilter = (queue, queueProfile) =>
    queue.filter(item => queueProfile.ServiceIds.includes(item.ServiceId))

  const QueueSorter = (item1, item2) => item1.MaxQueueTime < item2.MaxQueuetime ? 1 : -1

  try {
    if (!queue || !queueProfile) {
      return queue
    }
    const QueueFiltered = QueueFilter(queue, queueProfile)
    const QueueSorted = QueueFiltered.sort(QueueSorter)
    return censor ? Censor(QueueSorted) : QueueSorted
  }
  catch (err) {
    console.error('QueueProfile error:', queueProfile, err)
    return queue
  }

}



const App = () => {
  const [team, setTeam] = useState('') //active team
  const [censor, setCensor] = useState(false) //if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //list of teams and their chosen services
  const [queueProfile, setQueueProfile] = useState() //need to be GET only once

  useEffect(() => {
    //Teams = [{ TeamName, Profiles[{ TeamName, AgentId, AgentName, ServiceIds }] }]
    dataService.getTeams().then(response => response ? setTeams(response) : console.log('GetTeams failed', response))
    dataService.getAgents().then(response => setAgents(response))
    dataService.getQueue().then(response => setQueue(response))

    //change to 2-way listeners
    setInterval(() => { //update every 1h
      try {
        dataService.getAgents().then(response => setAgents(response))
        dataService.getQueue().then(response => setQueue(response))
      }
      catch(err) {
        console.log('Update error:', err)
      }
    }, 3000)

    setInterval(() => { //update every 1h
      dataService.getTeams().then(response => response ? setTeams(response) : console.log('GetTeams failed', response))
    }, 3600000) //1. per hour 1000*3600 = 3 600 000
  }, [])

  //want these to happen on each re-render? in theory wouldnt need to (eg no change).
  const AgentsFormatted = AgentFormatter(team, agents, censor)
  const QueueFormatted = QueueFormatter(queue, queueProfile, censor)


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
      <QueueSection queue={QueueFormatted} />
      <AgentSection agents={AgentsFormatted} />
      <OptionsSection OptItems={OptionsItems} />
      <BottomRight team={team} />
    </div>
  );
}

export default App;
