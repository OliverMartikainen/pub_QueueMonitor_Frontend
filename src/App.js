import React, { useState, useEffect } from 'react'
import AgentSection from './sections/AgentSection'
import QueueSection from './sections/QueueSection'
import OptionsSection from './sections/OptionsSection'
import TestLists from './tests/TestLists'
import dataService from './services/dataService'
import './App.css'

const BottomRight = ({ team, count }) => <div className="right-bottom"><h2>Team activated: {team}</h2><h2>{count}</h2></div>

const AgentFilter = (team, agents) => !team ? agents : agents.filter(agent => agent.Team === team)

const QueueFilter = (queue, teamFilter) => {
  if (!teamFilter || teamFilter.length === 0) {
    console.log(`queue filter is empty`)
    return queue
  }
  return queue.filter(item => teamFilter.includes(item.ServiceName))
}

const App = () => {
  const [team, setTeam] = useState("") //active team
  const [censor, setCensor] = useState(false) //if sensitive info needs to be hidden
  const [queue, setQueue] = useState([]) //for queue updates
  const [agents, setAgents] = useState([]) //for agent updates - show ones filtered by team
  const [teams, setTeams] = useState([]) //list of teams and their chosen services
  const [services, setServices] = useState([]) //need to be GET only once
  const [counter, setCounter] = useState(0)



  useEffect(() => { 
    //Teams updated every 1h in backend - atm need refresh in frontend
    dataService.getTeams().then(response => response ? setTeams(response) : console.log('GetTeams failed', response))
    //Teams = [{ TeamName, Profiles[{ TeamName, AgentId, AgentName, ServiceIds }] }]

    /*
    setInterval(() => {
      dataService.getAgents().then(response => setAgents(response))
      dataService.getQueue().then(response => setQueue(response))
    }, 6000)
    */

  }, [])


  useEffect(() => {
    setTimeout(
      () => {
        dataService.getAgents().then(response => response ? setAgents(response) : console.log('GetAgents failed', response))
        dataService.getQueue().then(response => response ? setQueue(response) : console.log('GetQueue failed', response) )
        setCounter(counter + 1)
      },
      6000
    )
  }, [counter])




  //func for service buttons in options - click to add/remove from teams service filter
  //prob move this to options section (once its tested and working)

  //chosen = false : needs to be added to teams service filter
  const updateTeamServices = (service, chosen) => {
    if (!team) {
      console.log("no team chosen")
      return false
    }
    const updateTeam = teams.find(t => t.TeamName === team)
    if (!chosen) { //add to service list
      updateTeam.services.push(service)
      setTeams(teams.filter(t => t.TeamNAme === team ? updateTeam : t))
      return true
    } else { //remove from service list
      updateTeam.services = updateTeam.services.filter(s => s !== service ? s : null)
      setTeams(teams.filter(t => t.TeamNAme === team ? updateTeam : t))
      return false
    }
  }

  //want these to happen on each re-render? in theory wouldnt need to (eg no change).
  const AgentsFiltered = AgentFilter(team, agents)
  const TeamFilter = !team ? null : teams.find(t => t.TeamName === team).services
  const QueueFiltered = QueueFilter(queue, TeamFilter)

  //SrvFunc, team, teams, setTeam, services, setServices, censor, setCensor(!censor)
  const OptionsItems = {
    SrvFunc: ((channel, add) => updateTeamServices(channel, add)),  //, teams, setTeams, team
    team: team, //to highlight chosen team
    teams: teams, //show all teams
    setTeam: setTeam, //for change team button
    services: services, //show all services
    censor: censor, //show current status
    setCensor: (() => setCensor(!censor)), //censor button func
  }

  //div child item orders matter!
  return (
    <div className="main">
      <QueueSection queue={QueueFiltered} /> 
      <AgentSection agents={AgentsFiltered} />
      <OptionsSection OptItems={OptionsItems} />
      <BottomRight team={team} count={counter} />
    </div>
  );
}

export default App;
