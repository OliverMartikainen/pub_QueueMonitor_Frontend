import axios from 'axios'
import config from '../utils/config'

const baseUrl = `${config.baseUrl}/pull`

//Only getTeams() used to initialize teams

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



/* app.js implementation of dataService

  const updateData = () =>
    dataService.getUpdates().then(response => {
      setConnectionStatus(response.status)
      if(response.status !== 200) {
        console.log('App updateData:',response.status, response.message)
        return
      }
      setQueue(response[0].data) //0 queue, 1 agents, 2 report
      setAgents(response[1].data)
      setReport(response[2].data)
      console.log('all normal in data')
      setConnectionStatus(200)
    }).catch(err => {
      console.log('error app update data', err)
      setConnectionStatus(111)
    })

      const updateTeams = () =>
    dataService.getTeams().then(response => {
      setConnectionStatus(response.status)
      if(response.status !== 200) {
        console.log('App updateTeams:',response.status, response.message)
        return
      }
      setTeams(response.data)
      console.log('all normal in teams')
    }).catch(error => {
      console.log('error app update teams', error)
      setConnectionStatus(111)
    })

      useEffect(() => {
    //Teams = [{ TeamName, Profiles[{ TeamName, AgentId, AgentName, ServiceIds }] }]
    updateTeams()
    //updateData()

    //aa()//event source testing
    dataUpdater()

    //change to 2-way listeners
    //setInterval(updateData, 4000) //update every 4 sec
    setInterval(updateTeams, 3600000) //1. per hour 1000*3600 = 3 600 000
  }, [])
*/

export default { getTeams, getUpdates }
