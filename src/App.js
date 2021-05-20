import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import OptionsSection from './components/OptionsSection'
import { dashboardUpdater, teamUpdater } from './streams/dataUpdaters'
import { queueFormatter, agentFormatter } from './utils/formatters'
import { changeProfileFunc, changeTeamFunc } from './events/buttonEvents'
import './App.css'

/**
 * dashboardStates typedefs
 * @typedef { Array<{ 
 *  AgentId: Number, 
 *  AgentName: String, 
 *  Duration: Number, //time agent has had current status
 *  Reason: String, //agents current status --> used in agent item color decision
 *  Team: String //agents TeamName
 * }>} queue
 * 
 * @typedef { Array<{ 
 *  ChannelId: Number, //not used
 *  ChannelName: String, //not used
 *  ContactType: 'PBX' | 'email',
 *  Direction: String, //not used
 *  ServiceName: String, 
 *  ServiceId: Number, 
 *  QueueLength: Number, 
 *  MaxQueueTime: Number 
 * }>} agents
 * 
 * @typedef {{
 *     reportPBX: Array.<{
 *          ContactsPieces: Number, //how many contacts received in total
 *          ProcessedPieces: Number, // how many of them were successfully answered
 *          ServiceId: Number, 
 *          ServiceName: String
 *      }>, 
 *      reportEmail: Array.<{
 *          ContactsPieces: Number, 
 *          ProcessedPieces: Number,
 *          ServiceId: Number, 
 *          ServiceName: String
 *      }>,
 *  }} report
 * 
 * @typedef {{ queue: queue, agents: agents, report: report }} dashboardStates
 */

/**
 * @typedef { Array<{ ServiceId: Number, ServiceName: String }>} services
 * 
 * @typedef { Array<{ 
 *  TeamName: String,
 *  Profiles: Array<{ 
 *      AgentFirstName: String, //used in place of AgentName if Censor === true
 *      AgentName: String, 
 *      AgentId: Number, 
 *      ServiceIds: Array<String> //service ids to use in queue dasboard if agent is active
 *  }>
 * }>} teams
 * 
 * this data needed since it only contains the teams official services. 
 * Teams object above contains every serviceId any member of team has in their profile --> different from teams official serviceIds list
 * - individual team members can have more services than the team. good for the queue, but not for statistics calculations
 * @typedef { Object.<String, { //TeamName properties used as keys - this data used in statistics
 *      TeamName: String, 
 *      emailServiceIds: Array<String>, //teams email serviceIds
 *      pbxServiceIds: Array<String> //teams pbx serviceIds
 * }>} teamServicesIndex
 * 
 * @typedef {{ teams: teams, services: services, teamServicesIndex: teamServicesIndex }} teamStates
 */


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
    const [activeAlarms, setActiveAlarms] = useState(defaultAlarms) /*{ServiceId: AlarmType} ServiceIds are unique numbers, Alarm type is 0-2 */
    const [activeProfileId, setQueueProfile] = useState(defaultProfile) //[ServiceIds] - Int --> QueueFilter

    //backends dataStream data storer - typedefs top of App.js
    /** @type {[ dashboardStates, React.Dispatch<React.SetStateAction<dashboardStates>> ]} */
    const [dashboardStates, setDasboardStates] = useState({
        queue: [], //[{ServiceName, SerivceId, ContactType, QueueLength, MaxQueueTime}]
        agents: [], //for agent updates - show ones filtered by team
        report: { reportPBX: [], reportEmail: [] } /*used for statistics --> { reportPBX: [{ContactsPieces: Number, ProcessedPieces: Number, ServiceId: Number, ServiceName: String}], reportEmail: [{same}] } */
    })


    //backends teamUpdater data storer - typedefs top of App.js
    /** @type {[ teamStates, React.Dispatch<React.SetStateAction<teamStates>> ]} */
    const [teamStates, setTeamStates] = useState({
        teams: [], //[{TeamName, Profiles[same as queueProfile]}]: list of teams and their chosen services
        services: [], /* [{ServiceName, ServiceId}]  - used in OptionsSection ServiceAlarmsModal*/
        teamServicesIndex: {} //indexed object by TeamName -> values are 
    })

    //200 OK, 502 database-backend error, 503 backend-frontend error --> combine for custom hook?
    const [connectionStatus, setConnectionStatus] = useState({ status: 200, errorStart: '' }) //{ Status: (200 or 502 or 503), ErrorStart: Date.ISOString} - using only DataUpdates to set error
    const [dataUpdateStatus, setDataUpdateStatus] = useState(200)

    const [censor, setCensor] = useState(false) //boolean: if sensitive info needs to be hidden

    //initiates SSE data update feed listeners
    useEffect(() => {
        const teamUpdateFeed = teamUpdater(setTeamStates)
        const dashboardUpdateFeed = dashboardUpdater(setDasboardStates, setDataUpdateStatus)
        //close SSE listeners on component demount
        return () => {
            teamUpdateFeed.close()
            dashboardUpdateFeed.close()
        }
    }, [])

    useEffect(() => {
        errorChecker(dataUpdateStatus, connectionStatus, setConnectionStatus)
    }, [dataUpdateStatus, connectionStatus])

    const { queue, agents, report } = dashboardStates
    const { teams, services, teamServicesIndex } = teamStates

    const agentsFormatted = agentFormatter(activeTeam, agents, censor, teams)
    const queueFormatted = queueFormatter(queue, activeProfileId, teams, censor)

    const changeProfile = (newProfile) => changeProfileFunc(newProfile, activeProfileId, setQueueProfile)
    const changeTeam = (newTeam) => changeTeamFunc(newTeam, activeTeam, setActiveTeam, changeProfile)

    return (
        <div id='main'>
            <Dashboard queue={ queueFormatted } activeAlarms={ activeAlarms } agents={ agentsFormatted } censor={ censor } />
            <OptionsSection
                {...{
                    activeTeam,
                    teams,
                    changeTeam,
                    activeProfileId,
                    changeProfile,
                    services,
                    teamServicesIndex,
                    censor,
                    setCensor: () => setCensor(!censor),
                    report,
                    connectionStatus,
                    activeAlarms,
                    setActiveAlarms
                }}
            />
        </div>
    )
}

export default App
