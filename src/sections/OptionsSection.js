//bottom left
import React from 'react'
import '../style/OptionsSection.css'

const OptionsSection = ({ OptItems }) => {
   //team, teams, setTeam, services, setServices, censor, setCensor(!censor)
    //console.log(OptItems)
    const teamList = OptItems.teams.map((team, index) =>
        <button key={index} onClick={() => OptItems.setTeam(team.TeamName)}>{team.TeamName}</button>
    )
    const censorMode = OptItems.censor ? 'On' : 'Off'

    return (
        <div className="left-bottom">
            <div className="options">
                <button className="option button">Options</button>
                <div className="options-content">
                    <button className="options-content button">Teams</button>
                    <div className="content-item">{teamList}</div>

                    <button className="options-content button">Channels</button>
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



