import React, { useState, useEffect } from 'react'
import AgentSection from './sections/AgentSection'
import QueueSection from './sections/QueueSection'
import OptionsSection from './sections/OptionsSection'
import dataService from './services/dataService'
import Censor from './utils/Censor'
import './App.css'

//add later cookie to save previous team & profile?

//Agents need to be sorted before censoring (sorted by surname, censor removes it)
const AgentFormatter = (team, agents, censor) => {
  if (!agents || agents.length === 0) {
    return []
  }
  const AgentFilter = (team, agents) => !team ? [] : ((team !== 'ALL TEAMS') ? agents.filter(agent => agent.Team === team) : agents)

  const AgentsFiltered = AgentFilter(team, agents)
  const AgentsSorted = AgentsFiltered.sort((a1, a2) => (a1.AgentName < a2.AgentName ? -1 : 1))
  return censor ? Censor(AgentsSorted) : AgentsSorted
}

//sorted in QueueSection
const QueueFormatter = (queue, queueProfile, censor) => {
  const QueueFilter = (queue, queueProfile) => {
    return !queueProfile ? [] : queue.filter(item => queueProfile.ServiceIds.includes(item.ServiceId))
  }

  try {
    if (!queue) {
      return queue
    }
    const QueueFiltered = QueueFilter(queue, queueProfile)
    return censor ? Censor(QueueFiltered) : QueueFiltered
  }
  catch (err) {
    console.error('QueueProfile error:', queueProfile, err)
    return queue
  }
}

const App = () => {
  const [team, setTeam] = useState('') //active team
  const [censor, setCensor] = useState(false) //if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //list of teams and their chosen services
  const [queueProfile, setQueueProfile] = useState()
  const [report, setReport] = useState('')
  const [connetionStatus, setConnectionStatus] = useState(404)

  console.log(dataService.getEventTest())

  const updateData = () =>
    dataService.getUpdates().then(response => {
      setConnectionStatus(response.status)
      if(response.status !== 200) {
        console.log('App updateData:',response.status, response.message)
        return
      }
      setQueue(response[0].data)
      setAgents(response[1].data)
      setReport(response[2].data)
      console.log('all normal in data')
      setConnectionStatus(200)
    }).catch(err => {
      console.log('error app update data', err)
      setConnectionStatus(000)
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
      setConnectionStatus(000)
      setTimeout(updateTeams, 10000) // try again in 10 sec
    })

  useEffect(() => {
    //Teams = [{ TeamName, Profiles[{ TeamName, AgentId, AgentName, ServiceIds }] }]
    updateTeams()
    updateData()

    //change to 2-way listeners
    setInterval(updateData, 4000) //update every 4 sec

    setInterval(updateTeams, 3600000) //1. per hour 1000*3600 = 3 600 000
  }, [])
  console.log(connetionStatus)

  //want these to happen on each re-render? in theory wouldnt need to (eg no change).
  const AgentsFormatted = AgentFormatter(team, agents, censor)
  const QueueFormatted = QueueFormatter(queue, queueProfile, censor)


  //team, teams, setTeam, queueProfile, setQueueProfile, censor, setCensor(!censor)
  const OptionsItems = {
    team: team, //to highlight chosen team
    teams: teams, //all teams & profiles
    setTeam: setTeam, //for change team button
    queueProfile: queueProfile, //highlight chosen profile
    setQueueProfile: setQueueProfile, //profiles button func
    censor: censor, //show current status
    setCensor: (() => setCensor(!censor)), //censor button func
    report,
  }

  //div child item orders matter! <BottomRight team={team} />
  return (
    <div className="main">
      <QueueSection queue={QueueFormatted} />
      <AgentSection agents={AgentsFormatted} />
      <OptionsSection OptItems={OptionsItems} />

    </div>
  );
}

export default App;
