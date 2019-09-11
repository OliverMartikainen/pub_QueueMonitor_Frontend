import axios from 'axios'

//const baseUrl = 'http://localhost:3001/api'
const baseUrl = 'http://FILI129603:3001/api' //for hosting in dev environment
//const baseUrl = './api'

const format = (request) => 
    request.then(response => response.data)


//api AgentsOnline
const getAgentsOnline = () => format(axios.get(`${baseUrl}/agentsonline`)) //api AgentsOnline
const getQueue = () => format(axios.get(`${baseUrl}/queue`)) //api GeneralQueue
const getTeams = () => format(axios.get(`${baseUrl}/teams`)) //[{TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}]
const getInboundReport = () => format(axios.get(`${baseUrl}/inboundreport`)) //[{ServiceName, ServiceId, ContactsPieces, ProcessedPieces}]

export default { getQueue, getTeams, getAgentsOnline, getInboundReport }
