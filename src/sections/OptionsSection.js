//bottom left
import React, { useState } from 'react'
import '../style/OptionsSection.css'
import Timer from '../components/Timer'

//gives the chosen teams profile list
const TeamProfile = (TeamName, teams) => !TeamName ? [] : teams.find(t => t.TeamName === TeamName).Profiles // a team's all profiles
//sorts the profile list into alphabetic order
const ProfileSorter = (p1, p2) => (p1.AgentName < p2.AgentName ? -1 : 1)


//add team ALL later
const OptionsSection = ({ OptItems }) => { //change to props?
    const [showModal, setShowModal] = useState(false)
    //, team, teams, setTeam, queueProfile, setQueueProfile, censor, setCensor(!censor)

    const teamFunc = (TeamName) => { //when team is changed queue profile set to new teams 'ALL' profile
        OptItems.setTeam(TeamName)
        const profile = TeamProfile(TeamName, OptItems.teams).find(p => p.AgentName === 'ALL')
        OptItems.setQueueProfile(profile)
    }

    const teamToggle = (team) => OptItems.team !== team ? "Unselected" : "Selected" //.css use
    const teamList = OptItems.teams.map((team, index) =>
        <button id={teamToggle(team.TeamName)} key={index} onClick={() => teamFunc(team.TeamName)}>{team.TeamName}</button>
    )

    //do some wicked code to make buttons seem toggle (eg check if in filter list)
    const profileToggle = (profile) => OptItems.queueProfile.AgentId !== profile.AgentId ? "Unselected" : "Selected" //.css use
    const profilesSorted = TeamProfile(OptItems.team, OptItems.teams).sort(ProfileSorter)
    const profilesList = profilesSorted.map((profile, index) =>
        <button id={profileToggle(profile)} key={index} onClick={() => { OptItems.setQueueProfile(profile) }}>{profile.AgentName}</button>
    )

    const censorMode = OptItems.censor ? 'On' : 'Off'
    const modalStyle = showModal ? { 'display': 'grid' } : { 'display': 'none' }

    //probably too many services and will have to make a modal? popup window for them.
    return (
        <div className="options-section">
            <div className="options">
                <button className="option button">
                    {!OptItems.team ? 'TEAM: NONE' : `TEAM: ${OptItems.team}`}
                </button>
                <div className="item">{teamList}</div>
            </div>
            <div className="options">
                <button className="option button">
                    {!OptItems.queueProfile.AgentName ? 'PROFILE: NONE' : `PROFILE: ${OptItems.queueProfile.AgentName}`}
                </button>
                <div className="item">{profilesList}</div>
            </div>

            <div className="options">
                <button className='option button' onClick={() => setShowModal(!showModal)}>TEST MODAL</button>
                <div className='modal-box' style={modalStyle}>
                    {profilesList}
                </div>
            </div>


            <button onClick={() => { OptItems.setTeam(""); OptItems.setQueueProfile({}) }}>Remove filters</button>
            <button onClick={OptItems.setCensor}>Censoring {censorMode}</button>
        </div>
    )
}

export default OptionsSection



