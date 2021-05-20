import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import OptionsSection from './components/OptionsSection'
import { dashboardUpdater, teamUpdater } from './streams/dataUpdaters'
import { queueFormatter, agentFormatter } from './utils/formatters'
import { changeProfileFunc, changeTeamFunc } from './events/buttonEvents'
import './App.css'

/**
 * @typedef { Array<{ 
 *  AgentId: Number, 
 *  AgentName: String, 
 *  Duration: Number, //time agent has had current status
 *  Reason: String, //agents current status --> used in agent item color decision
 *  Team: String //agents teamName
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

    //backends dataStream data storer
    /**
     * @type {[
     *  { queue: queue, agents: agents, report: report },
     *  React.Dispatch<React.SetStateAction<{ queue: queue, agents: agents, report: report }>>
     * ]}
     */
    const [dashboardData, setDasboardData] = useState({
        queue: [], //[{ServiceName, SerivceId, ContactType, QueueLength, MaxQueueTime}]
        agents: [], //for agent updates - show ones filtered by team
        report: { reportPBX: [], reportEmail: [] } /*used for statistics --> { reportPBX: [{ContactsPieces: Number, ProcessedPieces: Number, ServiceId: Number, ServiceName: String}], reportEmail: [{same}] } */
    })


    //backends teamUpdater data storer
    const [teams, setTeams] = useState([]) //[{TeamName, Profiles[same as queueProfile]}]: list of teams and their chosen services
    const [services, setServices] = useState([]) /* [{ServiceName, ServiceId}]  - used in OptionsSection ServiceAlarmsModal*/

    //200 OK, 502 database-backend error, 503 backend-frontend error --> combine for custom hook?
    const [connectionStatus, setConnectionStatus] = useState({ status: 200, errorStart: '' }) //{ Status: (200 or 502 or 503), ErrorStart: Date.ISOString} - using only DataUpdates to set error
    const [dataUpdateStatus, setDataUpdateStatus] = useState(200)

    const [censor, setCensor] = useState(false) //boolean: if sensitive info needs to be hidden

    //initiates SSE data update feed listeners
    useEffect(() => {
        teamUpdater(setTeams, setServices)
        dashboardUpdater(setDasboardData, setDataUpdateStatus)
    }, [])

    useEffect(() => {
        errorChecker(dataUpdateStatus, connectionStatus, setConnectionStatus)
    }, [dataUpdateStatus, connectionStatus])

    const { queue, agents, report } = dashboardData

    const agentsFormatted = agentFormatter(activeTeam, agents, censor, teams)
    const queueFormatted = queueFormatter(queue, activeProfileId, teams, censor)

    const changeProfile = (newProfile) => changeProfileFunc(newProfile, activeProfileId, setQueueProfile)
    const changeTeam = (newTeam) => changeTeamFunc(newTeam, activeTeam, setActiveTeam, changeProfile)

    return (
        <div id='main'>
            <Dashboard queue={ queueFormatted } activeAlarms={ activeAlarms } agents={ agentsFormatted } censor={ censor } />
            <OptionsSection
                activeTeam={ activeTeam }
                teams={ teams }
                changeTeam={ changeTeam }
                activeProfileId={ activeProfileId }
                changeProfile={ changeProfile }
                services={ services }
                censor={ censor }
                setCensor={ () => setCensor(!censor) }
                report={ report }
                connectionStatus={ connectionStatus }
                activeAlarms={ activeAlarms }
                setActiveAlarms={ setActiveAlarms }
            />
        </div>
    )

}

export default App
