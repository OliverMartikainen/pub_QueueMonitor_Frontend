import axios from 'axios'
import config from '../utils/config'

const baseUrl = `${config.baseUrl}/pull`

//Not being used atm - connets with backend "dataRouter"

const ErrorHandler = (error) => {
    //503 if frontend to backend problem
    //502 if backend to database problem (backend will send 'Database Error' as response)
    //500 for all unknowns
    if (error.message === 'Network Error') {
        error.status = 503
        console.log('t1', { error })
        return error
    }
    error.status = 500
    return error
}

//api AgentsOnline
const getAgentsOnline = () => axios.get(`${baseUrl}/agentsonline`)
const getQueue = () => axios.get(`${baseUrl}/queue`) //api GeneralQueue
const getInboundReport = () => axios.get(`${baseUrl}/inboundreport`) //[{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}]

//[{TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}]
const getTeams = () =>
    axios.get(`${baseUrl}/teams`)
        .then(response => {
            response.status = 200
            return response
        })
        .catch(error => {
            ErrorHandler(error)
            console.log('dataservice team error', error.message, error.status)
            return error
        })



const getUpdates = () => 
    axios.all([getQueue(), getAgentsOnline(), getInboundReport()])
        .then(response => {
            response.status = 200
            return response
        })
        .catch(error => {
            ErrorHandler(error)
            console.log('dataservice update error', error.message, error.status)
            return error
        })

export default { getTeams, getUpdates }
