import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import OptionsSection from './components/OptionsSection'
import { dashboardUpdater, teamUpdater } from './streams/dataUpdaters'
import { queueFormatter, agentFormatter } from './utils/formatters'
import { changeProfileFunc, changeTeamFunc } from './events/buttonEvents'
import './App.css'



/**
 * Checks for change in dataUpdateStatus (dataUpdate feeds status code)
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

  
  useEffect(() => {
    errorChecker(dataUpdateStatus, connectionStatus, setConnectionStatus)
  }, [dataUpdateStatus, connectionStatus])

  useEffect(() => {
    teamUpdater(setTeams, setServices)
    dashboardUpdater(setQueue, setAgents, setReport, setDataUpdateStatus)
  }, [])

  const agentsFormatted = agentFormatter(activeTeam, agents, censor, teams)
  const queueFormatted = queueFormatter(queue, activeProfileId, teams, censor)

  const changeProfile = (newProfile) => changeProfileFunc(newProfile, activeProfileId, setQueueProfile)
  const changeTeam = (newTeam) => changeTeamFunc(newTeam, activeTeam, setActiveTeam, changeProfile)

  return (
    <div id='main'>
      <Dashboard queue={queueFormatted} activeAlarms={activeAlarms} agents={agentsFormatted} censor={censor} />
      <OptionsSection 
        activeTeam={activeTeam}
        teams={teams}
        changeTeam={changeTeam}
        activeProfileId={activeProfileId}
        changeProfile={changeProfile}
        services={services}
        censor={censor}
        setCensor={() => setCensor(!censor)}
        report={report}
        connectionStatus={connectionStatus}
        activeAlarms={activeAlarms}
        setActiveAlarms={setActiveAlarms}
      />
    </div>
  )

}

export default App;
