import React, { useState, useEffect } from 'react'
import AgentSection from './sections/AgentSection'
import QueueSection from './sections/QueueSection'
import OptionsSection from './sections/OptionsSection'
import TestLists from './tests/TestLists'
import './App.css'

const BottomRight = ({ team }) => {

  return (
    <div className="right-bottom">
      <h2>Team activated: {team}</h2>
    </div>
  )
}

const AgentFilter = (team, agents) => {
  if (!team) {
    return agents
  }
  return agents.filter(agent => agent.Team === team)
}

//const TeamFilter = ()

const QueueFilter = (queue, teamFilter) => {
  if(!teamFilter) {
    console.log(`queue filter is empty`)
    return queue
  }
  return queue.filter(item => teamFilter.includes(item.ServiceName))
}

//in backend make Team list into {TeamName: , Services: }
const App = () => {
  const [team, setTeam] = useState("") //active team
  const [censor, setCensor] = useState(false) //if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //list of teams and their chosen services
  const [services, setServices] = useState([]) //need to be GET only once

  useEffect(() => { //to get inital info Queue and Agents will then be updated every 1-6seconds
    var teamp = [...TestLists.TeamList]
    teamp.map(team => team.services = [])
    setQueue(TestLists.QueueList)
    setAgents(TestLists.AgentsList)
    setTeams(teamp)
    setServices(TestLists.ServiceList)
  }, [])

  //func for service buttons in options - click to add/remove from teams service filter
  //prob move this to options section (once its tested and working)
  const updateTeamServices = (service, add, teams, setTeams, team) => {
    if(!team) {
      console.log("no team chosen")
      return false
    }
    const updateTeam = teams.find(t => t.TeamName === team)

    if(add) {
      updateTeam.services.push(service)
      setTeams(teams.filter(t => t.TeamNAme === team ? updateTeam : t))
    } else {
      updateTeam.services.filter(s => s !== service)
      setTeams(teams.filter(t => t.TeamNAme === team ? updateTeam : t))
    }
    console.log(teams)
  }

  //want these to happen on each re-render? in theory wouldnt need to (eg no change).
  const AgentsFiltered = AgentFilter(team, agents)
  const TeamFilter = !team ? null : teams.find(t => t.TeamName === team).services
  const QueueFiltered = QueueFilter(queue, TeamFilter)

  //SrvFunc, team, teams, setTeam, services, setServices, censor, setCensor(!censor)
  const OptionsItems = {
    SrvFunc: (() => updateTeamServices(services[0], true, teams, setTeams, team)),  //for service filtering buttons - needs rework
    team: team, //to highlight chosen team
    teams: teams, //show all teams
    setTeam: setTeam, //for change team button
    services: services, //show all services
    censor: censor, //show current status
    setCensor: (() => setCensor(!censor)), //censor button func
  }
  return (
    <div>
      <QueueSection calls={QueueFiltered} />

      <OptionsSection OptItems={OptionsItems} />

      <AgentSection agents={AgentsFiltered} />

      <BottomRight team={team} />
    </div>
  );
}

export default App;
