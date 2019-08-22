//bottom left
import React from 'react'
import '../style/OptionsSection.css'

const OptionsSection = ({ teams, team, setTeam, censor, setCensor, services, setServices }) => {
    //Buttons which change Team filter on click
    const teamList = teams.map((team, index) =>
        <button key={index} onClick={() => setTeam(team.TeamName)}>{team.TeamName}</button>
    )
    const censorMode = censor ? 'On' : 'Off'

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
            <button onClick={() => setTeam("")}>Remove filters</button>
            <button onClick={setCensor}>Censoring {censorMode}</button>
            <p>instead of % sizes use hard coded? to prevent overflows and allow having only part of this visible</p>
            <p>Team: {team}</p>
        </div>
    )
}


export default OptionsSection



