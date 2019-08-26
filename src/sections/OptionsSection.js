//bottom left
import React from 'react'
import '../style/OptionsSection.css'

const OptionsSection = ({ OptItems }) => {
    //SrvFunc, team, teams, setTeam, services, setServices, censor, setCensor(!censor)
    const filter = !OptItems.team ? null : OptItems.teams.find(team => team.TeamName === OptItems.team).services

    const serviceCheck = (service) => (!service || !filter) ? false : filter.includes(service)
    const serviceToggle = (service) => serviceCheck(service) ? "Selected" : "Unselected" //.css use - checks if current team has given service in its filter
    const teamToggle = (team) => OptItems.team !== team ? "Unselected" : "Selected" //.css use

    const teamList = OptItems.teams.map((team, index) =>
        <button id={teamToggle(team.TeamName)} key={index} onClick={() => OptItems.setTeam(team.TeamName)}>{team.TeamName}</button>
    )

    //do some wicked code to make buttons seem toggle (eg check if in filter list)
    const serviceList = OptItems.services.map((service, index) =>
        <button id={serviceToggle(service.ServiceName)} key={index} onClick={() => OptItems.SrvFunc(service.ServiceName, serviceCheck(service.ServiceName))}>
            {service.ServiceName}
        </button>
    )
    const censorMode = OptItems.censor ? 'On' : 'Off'

    //probably too many services and will have to make a modal? popup window for them.
    return (
        <div className="left-bottom">
            <div className="options">
                <button className="option button">Options</button>

                <div className="content team">
                    <button className="content-button">Teams</button>
                    <div className="item">{teamList}</div>
                </div>

                <div className="content channel">
                    <button className="button">Channels</button>
                    <div className="item">{serviceList}</div>
                </div>
            </div>
            <dir></dir>
            <button onClick={() => OptItems.setTeam("")}>Remove filters</button>
            <button onClick={OptItems.setCensor}>Censoring {censorMode}</button>
            <p>instead of % sizes use hard coded? to prevent overflows and allow having only part of this visible</p>
            <p>Team: {OptItems.team}</p>
        </div>
    )
}

export default OptionsSection



