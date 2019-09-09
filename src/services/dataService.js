import axios from 'axios'

//const baseUrl = 'http://localhost:3001/api'
const baseUrl = 'http://FILI129603:3001/api' //for hosting in dev environment
//const baseUrl = './api'

const format = (request) => 
    request.then(response => response.data)


//api AgentsOnline
const getAgents = () => format(axios.get(`${baseUrl}/agents`))
const getQueue = () => format(axios.get(`${baseUrl}/queue`)) //api GeneralQueue

const getTeams = () => format(axios.get(`${baseUrl}/teams`)) //array of team {TeamName, Profiles[{TeamName, AgentId, AgentName, ServiceIds}]}

export default { getQueue, getTeams, getAgents }
