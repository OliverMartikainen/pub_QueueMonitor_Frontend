import React, { useState, useEffect } from 'react'
import AgentSection from './components/AgentSection'
import QueueSection from './components/QueueSection'
import OptionsSection from './components/OptionsSection'
import eventService from './services/eventService'
import config from './utils/config'
import queueCensor from './utils/queueCensor'
import agentCensor from './utils/agentCensor'
import './App.css'

//Agents need to be sorted before censoring (sorted by surname, censor removes it)
const AgentFormatter = (activeTeam, agents, censor, teams) => {
  if (!agents || agents.length === 0) {
    return []
  }
  const AgentFilter = (team, agents) => !team ? [] : ((team !== 'ALL TEAMS') ? agents.filter(agent => agent.Team === team) : agents)

  const AgentsFiltered = AgentFilter(activeTeam, agents)
  const AgentsSorted = AgentsFiltered.sort((a1, a2) => (a1.AgentName < a2.AgentName ? -1 : 1))
  if(censor) {
    const teamProfiles = teams.find(t => t.TeamName === activeTeam).Profiles
    return agentCensor(AgentsSorted, teamProfiles) //takes first names from agentProfiles and replaces agentsOnline names
  }
  return AgentsSorted
}

//sorted in QueueSection
const QueueFormatter = (queue, activeTeam, activeProfile, teams, censor) => {
  try {
    if (!queue || !activeTeam || !activeProfile || teams.length === 0) {
      return []
    }
    const QueueFilter = (queue, queueProfile) => {
      return (!queueProfile || !queueProfile.ServiceIds) ? [] : queue.filter(item => queueProfile.ServiceIds.includes(item.ServiceId))
    }
    const activeTeamProfiles = teams.find(t => t.TeamName === activeTeam).Profiles
    const queueProfile = !activeTeamProfiles ? [] : activeTeamProfiles.find(p => p.AgentId === activeProfile)

    const QueueFiltered = QueueFilter(queue, queueProfile)
    return censor ? queueCensor(QueueFiltered) : QueueFiltered
  }
  catch (err) {
    console.error('QueueProfile error:', activeProfile, err)
    return queue
  }
}

const dataUpdater = (setQueue, setAgents, setReport, connectionStatus, setConnectionStatus) => {
  const dataUpdates = eventService.getDataUpdates()
  dataUpdates.onopen = (event) => {
    const time = new Date().toISOString().substr(11, 8)
    console.log(`dataUpdates OPEN:`, time)
  }
  dataUpdates.onerror = (event) => { //happens when frontend-backend connection is down
    const time = new Date().toISOString().substr(11, 8)
    console.log(`dataUpdates ERROR: `, time)
    if(connectionStatus.status === 200) {
      setConnectionStatus({status: 503, errorStart: time})
    }
    if(connectionStatus.status === 502) {
      connectionStatus.status = 503
      setConnectionStatus(connectionStatus) //keep errorStart time
    }
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
    if(connectionStatus.status !== 200) {
      setConnectionStatus({status: 200, errorStart: ''})
    }
  }
}

//for some reasons TeamName 'ALL TEAMS' bugs all the teams Profiles AgentId's
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
    const data = JSON.parse(event.data)
    if (data.status !== 200) {
      const time = new Date().toISOString().substr(11, 8)
      console.log('TEAM UPDATE FAILED', data.status, time)
      return
    }
    setTeams(data.teams)
  }
}

//if no queueuProfile stored in browser set empty profile as starting queueProfile - changing this might cause problems
const defaultProfile = () => {
  const storageProfile = window.localStorage.getItem('activeProfileId')
  const defaultProfile = ''
  return (!storageProfile ? defaultProfile : parseInt(storageProfile))
}

//if no team stored in browser set '' as starting team - changing this might cause problems
const defaultTeam = () => {
  const storageTeam = window.localStorage.getItem('activeTeam')
  const defaultTeam = ''
  return (!storageTeam ? defaultTeam : storageTeam)
}

//show all useState object requirements here
const App = () => {
  const [activeTeam, setActiveTeam] = useState(defaultTeam) //String
  const [activeProfileId, setQueueProfile] = useState(defaultProfile) //Int
  const [censor, setCensor] = useState(false) //boolean: if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //[{ServiceName, SerivceId, MaxQueueWait?}]: for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
    //teams in theory only need ALL TEAMS team - then filter by team name - has all profiles in it with their original team name... but there isnt really any need for optimization at this point
  const [teams, setTeams] = useState([]) //[{TeamName, Profiles[same as queueProfile]}]: list of teams and their chosen services
  const [report, setReport] = useState('')
  //200 OK, 502 database-backend error, 503 backend-frontend error
  const [connectionStatus, setConnectionStatus] = useState({status: 200, errorStart: ''}) //{ Status: (200 or 502 or 503), ErrorStart: Date.ISOString} - using only DataUpdates to set error

  //both used in OptionsSection & OptionsModal components
  const changeProfile = (newProfile) => {
    window.localStorage.setItem('activeProfileId', newProfile)
    setQueueProfile(newProfile)
  }
  const changeTeam = (newTeam) => {
    window.localStorage.setItem('activeTeam', newTeam)
    setActiveTeam(newTeam)
    if (newTeam === '') { //removeFilters button functionality
      changeProfile('')
      return
    }
    //on team change chooses teams ALL profile
    const teamProfiles = teams.find(t => t.TeamName === newTeam).Profiles
    const profile = teamProfiles.find(p => (newTeam !== 'ALL TEAMS') ? (p.AgentName === `ALL ${newTeam}`) : (p.AgentName === newTeam))
    changeProfile(profile.AgentId)
  }

  useEffect(() => {
    //window.localStorage.clear()
    teamUpdater(setTeams)
    dataUpdater(setQueue, setAgents, setReport, connectionStatus, setConnectionStatus)
    const storageProfile = window.localStorage.getItem('activeProfileId')
    const storageTeam = window.localStorage.getItem('activeTeam')
    console.log('a', storageTeam, 'b', storageProfile)
  }, [])

  //want these to happen on each re-render?
  const AgentsFormatted = AgentFormatter(activeTeam, agents, censor, teams)
  const QueueFormatted = QueueFormatter(queue, activeTeam, activeProfileId, teams, censor)

  //activeTeam, teams, changeTeam, activeProfileId, changeProfile, censor, setCensor(!censor), connectionStatus
  const OptItems = {
    activeTeam: activeTeam, //to highlight chosen team
    teams: teams, //all teams & profiles
    changeTeam: changeTeam, //for change team button
    activeProfileId: activeProfileId, //highlight chosen profile
    changeProfile: changeProfile, //profiles button func
    censor: censor, //show current status
    setCensor: (() => setCensor(!censor)), //censor button func
    report,
    connectionStatus
  }

  return (
    <div className='main'>
      <QueueSection queue={QueueFormatted} />
      <AgentSection agents={AgentsFormatted} censor={censor} />
      <OptionsSection OptItems={OptItems} />
    </div>
  )

}

export default App;
