import React, { useState, useEffect } from 'react'
import AgentSection from './components/AgentSection'
import QueueSection from './components/QueueSection'
import OptionsSection from './components/OptionsSection'
import eventService from './services/eventService'
import config from './utils/config'
import Censor from './utils/Censor'
import './App.css'

//add later cookie to save previous team & profile?

//Agents need to be sorted before censoring (sorted by surname, censor removes it)
const AgentFormatter = (team, agents, censor) => {
  if (!agents || agents.length === 0) {
    return []
  }
  const AgentFilter = (team, agents) => !team ? [] : ((team !== 'ALL TEAMS') ? agents.filter(agent => agent.Team === team) : agents)

  const AgentsFiltered = AgentFilter(team, agents)
  const AgentsSorted = AgentsFiltered.sort((a1, a2) => (a1.AgentName < a2.AgentName ? -1 : 1))
  return censor ? Censor(AgentsSorted) : AgentsSorted
}

//sorted in QueueSection
const QueueFormatter = (queue, queueProfile, censor) => {
  const QueueFilter = (queue, queueProfile) => {
    return !queueProfile ? [] : queue.filter(item => queueProfile.ServiceIds.includes(item.ServiceId))
  }

  try {
    if (!queue) {
      return queue
    }
    const QueueFiltered = QueueFilter(queue, queueProfile)
    return censor ? Censor(QueueFiltered) : QueueFiltered
  }
  catch (err) {
    console.error('QueueProfile error:', queueProfile, err)
    return queue
  }
}

  const dataUpdater = (setQueue, setAgents, setReport) => {
    const dataUpdates = eventService.getDataUpdates()
    dataUpdates.onopen = (event) => {
      const time = new Date().toISOString().substr(11,8)
      console.log(`dataUpdates OPEN:`, time)
    }
    dataUpdates.onerror = (event) => {
      const time = new Date().toISOString().substr(11,8)
      console.log(`dataUpdates ERROR: `,time)
    }
    dataUpdates.onmessage = (event) => {
      if (event.origin.toLocaleLowerCase() !== config.baseOrigin.toLocaleLowerCase()) {
        const time = new Date().toISOString().substr(11,8)
        console.log('origin error', time, event.origin)
      }
      const data = JSON.parse(event.data)
      //console.log(`dataUpdates MESSAGE: `, data.timeStamp)
      setQueue(data.queue)
      setAgents(data.agentsOnline)
      setReport(data.report)
    }
  }

  const teamUpdater = (setTeams) => {
    const teamUpdates = eventService.getTeamUpdates()
    teamUpdates.onopen = (event) => {
      const time = new Date().toISOString().substr(11,8)
      console.log(`teamUpdates OPEN:`, time)
    }
    teamUpdates.onerror = (event) => {
      const time = new Date().toISOString().substr(11,8)
      console.log(`teamUpdates ERROR: `, time)
    }
    teamUpdates.onmessage = (event) => {
      if (event.origin.toLocaleLowerCase() !== config.baseOrigin.toLocaleLowerCase()) {
        console.log('origin error', event.origin)
      }
      const data = JSON.parse(event.data)
      if(data.status !== 200) {
        const time = new Date().toISOString().substr(11,8)
        console.log('TEAM UPDATE FAILED', data.status, time)
        return
      }
      console.log(`teamUpdates MESSAGE: `, data.timeStamp)
      setTeams(data.teams)
    }
  }

const App = () => {
  const [team, setTeam] = useState('') //active team
  const [censor, setCensor] = useState(false) //if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //list of teams and their chosen services
  const [queueProfile, setQueueProfile] = useState()
  const [report, setReport] = useState('')
  const [connectionStatus, setConnectionStatus] = useState(404)

  const storageTeam = window.localStorage.getItem('team')
  const storageProfile = window.localStorage.getItem('queueProfile')
  console.log('a',storageTeam,'b', storageProfile)

  useEffect(() => {
    teamUpdater(setTeams)
    dataUpdater(setQueue, setAgents, setReport)
    const storageProfile = window.localStorage.getItem('queueProfile')
    console.log('a',storageTeam,'b', storageProfile)

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
    report,
  }
  console.log(OptionsItems.team)
  console.log(OptionsItems.teams)

  //div child item orders matter! <BottomRight team={team} />
  /*
      <div className='queue-section'></div>
      <div className='agent-section'></div>
      <div className='options-section'></div>
  */
  return (
    <div className='main'>
      <QueueSection queue={QueueFormatted} />
      <AgentSection agents={AgentsFormatted} />
      <OptionsSection OptItems={OptionsItems} />
    </div>
  )
}

export default App;
