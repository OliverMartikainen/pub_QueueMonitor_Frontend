//bottom left
import React, { useState } from 'react'
import '../style/OptionsSection.css'
import StatsCounter from '../utils/StatsCounter'




//gives the chosen teams profile list
const TeamProfile = (TeamName, teams) => !TeamName ? [] : teams.find(t => t.TeamName === TeamName).Profiles // a team's all profiles
//sorts the profile list into alphabetic order
const ProfileSorter = (p1, p2) => (p1.AgentName < p2.AgentName ? -1 : 1)

const SearchList = ({ list, column, header }) => {
    const [filter, setFilter] = useState('')

    const handleFilter = (event) => setFilter(event.target.value)

    const filtered_list = !list ? list : list.filter(item => item.props.children.toLowerCase().includes(filter.toLowerCase()))
    const style = { 'gridColumn': column }
    return (
        <div className={'modal-list'} style={style} >
            <div className={'modal-search'}>
                <h3>{header}</h3>
                Search: <input value={filter} onChange={handleFilter} />
                {filtered_list}
            </div>
        </div>
    )
}

const OptionsModal = ({ profiles, teams, showModal }) => {
    const modalId = showModal ? 'show' : 'hide'

    return (

        <div className='modal-box' id={modalId} >
            <SearchList list={teams} column={1} header={'TEAMS'} />
            <SearchList list={profiles} column={2} header={'PROFILES'} />
        </div>

    )
}


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
    let profilesSorted = TeamProfile(OptItems.team, OptItems.teams).sort(ProfileSorter)
    const profilesList = profilesSorted.map((profile, index) =>
        <button id={profileToggle(profile)} key={index} onClick={() => { OptItems.setQueueProfile(profile) }}>{profile.AgentName}</button>
    )

    const censorMode = OptItems.censor ? 'On' : 'Off'
    //probably too many services and will have to make a modal? popup window for them.
    return (
        <div className="options-section">

            <button className='option button' onClick={() => setShowModal(!showModal)}>CHOOSE FILTERS</button>
            <OptionsModal teams={teamList} profiles={profilesList} showModal={showModal} />

            <button onClick={() => { OptItems.setTeam(''); OptItems.setQueueProfile() }}>Remove filters</button>
            <button onClick={OptItems.setCensor}>Censoring {censorMode}</button>
            <h2>Team activated: {!OptItems.team ? 'NONE' : OptItems.team} | Stats: {StatsCounter.TeamStats(OptItems.report, OptItems.team, OptItems.teams)}</h2>
            <h2>Profile activated: {!OptItems.queueProfile ? 'NONE' : OptItems.queueProfile.AgentName} | Stats: {StatsCounter.ProfileStats(OptItems.report, OptItems.queueProfile)}</h2>
        </div>
    )
}

export default OptionsSection



