import React, { useState, useEffect } from 'react'
import AgentSection from './components/AgentSection'
import QueueSection from './components/QueueSection'
import OptionsSection from './components/OptionsSection'
import eventService from './services/eventService'
import dataServices from './services/dataService'
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
const QueueFormatter = (queue, activeTeam, activeProfile, teams, censor) => {
  try {
    const activeTeamProfiles = teams.find(t => t.TeamName === activeTeam)
    const queueProfile = !activeTeamProfiles ? [] : activeTeamProfiles.Profiles.find(p => p.AgentId = activeProfile)
    const QueueFilter = (queue, queueProfile) => {
      return (!queueProfile || !queueProfile.ServiceIds) ? [] : queue.filter(item => queueProfile.ServiceIds.includes(item.ServiceId))
    }
    if (!queue) {
      return queue
    }
    const QueueFiltered = QueueFilter(queue, queueProfile)
    return censor ? Censor(QueueFiltered) : QueueFiltered
  }
  catch (err) {
    console.error('QueueProfile error:', activeProfile, err)
    return queue
  }
}

const dataUpdater = (setQueue, setAgents, setReport) => {
  const dataUpdates = eventService.getDataUpdates()
  dataUpdates.onopen = (event) => {
    const time = new Date().toISOString().substr(11, 8)
    console.log(`dataUpdates OPEN:`, time)
  }
  dataUpdates.onerror = (event) => {
    const time = new Date().toISOString().substr(11, 8)
    console.log(`dataUpdates ERROR: `, time)
  }
  dataUpdates.onmessage = (event) => {
    if (event.origin.toLocaleLowerCase() !== config.baseOrigin.toLocaleLowerCase()) {
      const time = new Date().toISOString().substr(11, 8)
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
    const time = new Date().toISOString().substr(11, 8)
    console.log(`teamUpdates OPEN:`, time)
  }
  teamUpdates.onerror = (event) => {
    const time = new Date().toISOString().substr(11, 8)
    console.log(`teamUpdates ERROR: `, time)
  }
  teamUpdates.onmessage = (event) => {
    if (event.origin.toLocaleLowerCase() !== config.baseOrigin.toLocaleLowerCase()) {
      console.log('origin error', event.origin)
    }
    const data1 = event.data
    const data = JSON.parse(data1) 
    //ALL TEAMS has only 1 profile including all services. ALL TEAMS profiles agent id is bugged. only explanation 
    if (data.status !== 200) {
      const time = new Date().toISOString().substr(11, 8)
      console.log('TEAM UPDATE FAILED', data.status, time)
      return
    }
    const a = data.teams[0].Profiles[0]
    console.log(a)
    setTeams(data.teams)
  }
}

//window.localStorage.setItem for both done in OptionModal in teamFunc & profileFunc
//if no queueuProfile stored in browser set empty profile as starting queueProfile - changing this might cause problems
const defaultProfile = () => {
  const storageProfile = window.localStorage.getItem('queueProfile')
  const defaultProfile = undefined
  return (!storageProfile || storageProfile === 'undefined')  ? defaultProfile : JSON.parse(storageProfile)
}

//if no team stored in browser set '' as starting team - changing this might cause problems
const defaultTeam = () => {
  const storageTeam = window.localStorage.getItem('activeTeam')
  const defaultTeam = ''
  return (!storageTeam ? defaultTeam : storageTeam)
}

/* once you change queueProfile to string and make it more dynamic this will work...
const changeProfile = (newProfile) => {
  setQueueProfile(newProfile)
  window.localStorage.setItem('queueProfile', JSON.stringify(newProfile))
}
const changeActiveTeam = (newTeam) => {

}
*/

//show all useState object requirements here
const App = () => {
  const [activeTeam, setTeam] = useState(defaultTeam) //String
  const [activeProfileId, setQueueProfile] = useState(defaultProfile) //should rework to string now {AgentId, AgentName, TeamName, ServiceIds[]}
  const [censor, setCensor] = useState(false) //boolean: if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //[{ServiceName, SerivceId, MaxQueueWait?}]: for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //[{TeamName, Profiles[same as queueProfile]}]: list of teams and their chosen services
  const [report, setReport] = useState('')
  const [connectionStatus, setConnectionStatus] = useState(404) //Int (200, 502, 503)


  useEffect(() => {
    teamUpdater(setTeams)
    dataUpdater(setQueue, setAgents, setReport)
    const storageProfile = window.localStorage.getItem('queueProfile')
    const storageTeam = window.localStorage.getItem('activeTeam')
    console.log('a', storageTeam, 'b', storageProfile)
  }, [])

  console.log('acP APP', activeProfileId)
  //want these to happen on each re-render? in theory wouldnt need to (eg no change).
  const AgentsFormatted = AgentFormatter(activeTeam, agents, censor)
  const QueueFormatted = QueueFormatter(queue, activeTeam, activeProfileId, teams, censor)
 
  //team, teams, setTeam, queueProfile, setQueueProfile, censor, setCensor(!censor)
  const OptionsItems = {
    activeTeam: activeTeam, //to highlight chosen team
    teams: teams, //all teams & profiles
    setTeam: setTeam, //for change team button
    activeProfileId: activeProfileId, //highlight chosen profile
    setQueueProfile: setQueueProfile, //profiles button func
    censor: censor, //show current status
    setCensor: (() => setCensor(!censor)), //censor button func
    report,
  }

  return (
    <div className='main'>
      <QueueSection queue={QueueFormatted} />
      <AgentSection agents={AgentsFormatted} />
      <OptionsSection OptItems={OptionsItems} />
    </div>
  )
}

export default App;
