import React, { useState, useEffect } from 'react'
import AgentSection from './components/AgentSection'
import QueueSection from './components/QueueSection'
import OptionsSection from './components/OptionsSection'
import eventService from './services/eventService'
import queueCensor from './utils/queueCensor'
import agentCensor from './utils/agentCensor'
import filterUtils from './utils/filterUtils'
import './App.css'

//Agents need to be sorted before censoring (sorted by surname, censor removes it)
const agentFormatter = (activeTeam, agents, censor, teams) => {
  if (!agents || agents.length === 0 || activeTeam.length === 0 || teams.length === 0) {
    return []
  }
  try {
    const activeAgents = filterUtils.findActiveAgents(agents, activeTeam)
    const AgentsSorted = activeAgents.sort((a1, a2) => (a1.AgentName < a2.AgentName ? -1 : 1))

    if (censor) {
      const allProfiles = teams.find(t => t.TeamName === 'ALL TEAMS').Profiles
      return agentCensor(AgentsSorted, allProfiles) //takes first names from agentProfiles and replaces agentsOnline names
    }

    return AgentsSorted

  } catch (error) {
    console.log('a', activeTeam, 'b', agents, 'c', censor, 'd', teams)
    console.error('Wild AgentSorting error', error)
    return []
  }
}

//sorted in QueueSection
const queueFormatter = (queue, activeProfileIds, teams, censor) => {
  try {
    if (activeProfileIds.length === 0 || queue.length === 0 || teams.length === 0) {
      return []
    }

    const activeQueueItems = filterUtils.findActiveQueueItems(queue, activeProfileIds, teams)

    return censor ? queueCensor(activeQueueItems) : activeQueueItems
  }
  catch (err) {
    console.error('QueueProfile error:', activeProfileIds, err)
    return queue
  }
}

const dataUpdater = (setQueue, setAgents, setReport, setDataUpdateStatus) => {
  let dataUpdates = eventService.getDataUpdates()
  dataUpdates.onopen = (event) => {
    const time = new Date().toISOString().substr(11, 8)
    console.log(`dataUpdates OPEN:`, time)
  }
  dataUpdates.onerror = (event) => { //happens when frontend-backend connection is down
    const time = new Date().toISOString().substr(11, 8)
    console.log(`dataUpdates ERROR: `, time)
    setDataUpdateStatus(503)
    dataUpdates.close() //without this & the setTimeout() firefox will close connection on 2nd error
    setTimeout(
      () => dataUpdater(setQueue, setAgents, setReport, setDataUpdateStatus)
      , 10000)
  }
  dataUpdates.onmessage = (event) => {
    /* need to import util.config for this to work, also add origin to config.
    if (event.origin.toLocaleLowerCase() !== config.baseOrigin.toLocaleLowerCase()) {
      const time = new Date().toISOString().substr(11, 8)
      console.log('origin error', time, event.origin)
    }*/
    const data = JSON.parse(event.data)

    if (data.status !== 200) {
      const time = new Date().toISOString()
      setDataUpdateStatus(data.status)
      console.log('TEAM UPDATE FAILED', data.status, time)
      return
    }
    //console.log(`dataUpdates MESSAGE: `, data.timeStamp)
    const report = {
      reportPBX: data.reportPBX,
      reportEmail: data.reportEmail
    }
    setQueue(data.queue)
    setAgents(data.agentsOnline)
    setReport(report)
    setDataUpdateStatus(200)
  }
}

//happens approx every 30min/1h - checks server version vs local storage version
const teamUpdater = (setTeams, setServices) => {
  const teamUpdates = eventService.getTeamUpdates()
  teamUpdates.onopen = (event) => {
    const time = new Date().toISOString().substr(11, 8)
    console.log(`teamUpdates OPEN:`, time)
  }
  teamUpdates.onerror = (event) => {
    const time = new Date().toISOString().substr(11, 8)
    console.log(`teamUpdates ERROR: `, time)
    teamUpdates.close()
    setTimeout(
      () => teamUpdater(setTeams, setServices)
      , 10000)
  }
  teamUpdates.onmessage = (event) => {
    /*
    if (event.origin.toLocaleLowerCase() !== config.baseOrigin.toLocaleLowerCase()) {
      console.log('origin error', event.origin) //not actually doing anything with this atm
    }*/

    const data = JSON.parse(event.data)

    if (data.status !== 200) {
      const time = new Date().toISOString().substr(11, 8)
      console.log('TEAM UPDATE FAILED', data.status, time)
      return
    }

    const serverVersion = window.localStorage.getItem('serverVersion') //restarts on browser open if it has old version stored - could avoid with close browser actions
    if (serverVersion && (serverVersion !== data.serverVersion)) {  //if there is a stored server version compare it to data.serverVersion and refresh client if different
      window.location.reload(true)
    }

    window.localStorage.setItem('serverVersion', data.serverVersion)
    setTeams(data.teams)
    setServices(data.services)
  }
}

/**
 * Checks for change in dataUpdateStatus (dataUpdate feeds status code)
 *  
 * @param {*} dataUpdateStatus 
 * @param {*} connectionStatus 
 * @param {*} setConnectionStatus 
 */
const errorChecker = (dataUpdateStatus, connectionStatus, setConnectionStatus) => {
  if (connectionStatus.status !== dataUpdateStatus) {
    const time = new Date().toISOString()
    setConnectionStatus({ status: dataUpdateStatus, time: time })
  }
}

//if no queueuProfile stored in browser set empty profile as starting queueProfile - changing this might cause problems
const defaultProfile = () => {
  const storageProfile = window.localStorage.getItem('activeProfileId')
  const defaultProfile = []
  return (!storageProfile ? defaultProfile : storageProfile.split(',').map(id => parseInt(id)))
}

//if no team stored in browser set [] as starting team - changing this might cause problems
const defaultTeam = () => {
  const storageTeam = window.localStorage.getItem('activeTeam')
  const defaultTeam = []
  return (!storageTeam ? defaultTeam : storageTeam.split(','))
}

const defaultAlarms = () => {
  const storageAlarms = window.localStorage.getItem('activeAlarms')
  const defaultAlarms = {}
  return ((storageAlarms === undefined || !storageAlarms) ? defaultAlarms : JSON.parse(storageAlarms))
}

const App = () => { //Change activeTeam to shownAgents --> [AgentIds] --> agentfilter OR add this and keep activeTeam for options filter only?
  const [activeTeam, setActiveTeam] = useState(defaultTeam) //[TeamNames] - String --> AgentFilter - database doesnt provide TeamIds
  const [activeProfileId, setQueueProfile] = useState(defaultProfile) //[ServiceIds] - Int --> QueueFilter
  const [activeAlarms, setActiveAlarms] = useState(defaultAlarms) /*{ServiceId: AlarmType} ServiceIds are unique numbers, Alarm type is 0-2 */
  const [censor, setCensor] = useState(false) //boolean: if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //[{ServiceName, SerivceId, ContactType, QueueLength, MaxQueueTime}]
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //[{TeamName, Profiles[same as queueProfile]}]: list of teams and their chosen services
  const [report, setReport] = useState('')
  const [services, setServices] = useState([]) /* [{ServiceName, ServiceId}]  - used in OptionsSection ServiceAlarmsModal*/
  //200 OK, 502 database-backend error, 503 backend-frontend error --> combine for custom hook?
  const [connectionStatus, setConnectionStatus] = useState({ status: 200, errorStart: '' }) //{ Status: (200 or 502 or 503), ErrorStart: Date.ISOString} - using only DataUpdates to set error
  const [dataUpdateStatus, setDataUpdateStatus] = useState(200)

  //chanceProfile & changeTeam are button functions used in OptionsSection & OptionsModal components - should extract these somewhere else...
  //create ButtonFuncions.changeProfile? component? 
  const changeProfile = (newProfile) => { //newProfile is Int
    //props --> activeProfileId (Int array), newProfile, setQueueProfile()
    const doProfileChange = (newProfileFilter) => {
      window.localStorage.setItem('activeProfileId', newProfileFilter.toString())
      setQueueProfile(newProfileFilter)
    }
    const addProfile = () => [...activeProfileId, newProfile]
    const removeProfile = () => activeProfileId.filter(id => id !== newProfile)

    if (newProfile === '') { //on remove filters
      doProfileChange([])
      return
    }
    if (activeProfileId.includes(1)) { //1 === 'ALL TEAMS' profile
      if (newProfile === 1) {
        doProfileChange([])
        return
      }
      doProfileChange([newProfile])
      return
    }
    if (newProfile === 1) {
      doProfileChange([newProfile])
      return
    }
    const newProfileFilter = activeProfileId.includes(newProfile) ? removeProfile() : addProfile()
    doProfileChange(newProfileFilter)
  }

  const changeTeam = (newTeam) => { //newTeam is String
    //props --> activeTeam, newTeam, setActiveTeam(), changeProfile()
    const doTeamChange = (newTeamFilter) => {
      window.localStorage.setItem('activeTeam', newTeamFilter.toString())
      setActiveTeam(newTeamFilter)
    }
    const addTeam = () => [...activeTeam, newTeam]
    const removeTeam = () => activeTeam.filter(teamName => teamName !== newTeam)

    if (newTeam === '') {
      changeProfile('')
      doTeamChange([])
      return
    }
    if (activeTeam.includes('ALL TEAMS')) {
      if (newTeam === 'ALL TEAMS') {
        doTeamChange([])
        return
      }
      doTeamChange([newTeam])
      return
    }
    if (newTeam === 'ALL TEAMS') { //avoids duplicate profiles list - room for rework in whole 'teams' listing.
      doTeamChange([newTeam])
      return
    }
    const newTeamFilter = activeTeam.includes(newTeam) ? removeTeam() : addTeam()
    doTeamChange(newTeamFilter)
  }




  useEffect(() => {
    errorChecker(dataUpdateStatus, connectionStatus, setConnectionStatus)
  }, [dataUpdateStatus, connectionStatus])

  useEffect(() => {
    teamUpdater(setTeams, setServices)
    dataUpdater(setQueue, setAgents, setReport, setDataUpdateStatus)
  }, [])

  const agentsFormatted = agentFormatter(activeTeam, agents, censor, teams)
  const queueFormatted = queueFormatter(queue, activeProfileId, teams, censor)

  /* OptItems:
  activeTeam, teams, changeTeam, activeProfileId, changeProfile,
  services, censor, setCensor(!censor),
  connectionStatus, activeAlarms, setActiveAlarms 
   */
  const OptItems = {
    activeTeam: activeTeam, //to highlight chosen team
    teams: teams, //all teams & profiles
    changeTeam: changeTeam, //for change team button
    activeProfileId: activeProfileId, //highlight chosen profile
    changeProfile: changeProfile, //profiles button func
    services: services, //used to show all selected services
    censor: censor, //show current status
    setCensor: (() => setCensor(!censor)), //censor button func
    report,
    connectionStatus,
    activeAlarms,
    setActiveAlarms
  }

  return (
    <div className='main'>
      <QueueSection queue={queueFormatted} activeAlarms={activeAlarms} />
      <AgentSection agents={agentsFormatted} censor={censor} />
      <OptionsSection OptItems={OptItems} />
    </div>
  )

}

export default App;
