import axios from 'axios'
import testUrls from '../tests/testUrl'

//later add token/user access restriction
const baseUrl = 'http://localhost:3001/api'

const format = (request) => request.then(response => response.data)

const getHelloWorld = () => axios.get(testUrls.Url1)

const getAgents = () => format(axios.get(`${baseUrl}/agents`))
const getQueue = () => format(axios.get(`${baseUrl}/queue`))

const getServices = () => format(axios.get(`${baseUrl}/services`)) //get Services - once per day

const getTeams = () => format(axios.get(`${baseUrl}/teams`))
//should give a team id and service to add to the team (at least)
const putTeams = (id) => format(axios.put(`${baseUrl}/teams/${id}`))

export default {getHelloWorld, getQueue, getServices, getTeams, putTeams, getAgents}

// local datafeeds:
    //AT START: get&putTEAMS[{TeamName, services, users[id]}] - get / update (checks 1 per day? for new teams?)
    //AT START: getSERVICES[ServiceName] - get | pretty much unaltered feed from data source
    //CONTINUOUS: getUpdates | Queue & Agents - in setInterval

    //AT START: get&put&createUsers | own service, not needed yet


//could send team id in header and then filtering agents & queue in backend - do first this way
    //might make authority confirmation simpler too? less info in frontend?