//bottom left
import React, { useState } from 'react'
import '../style/OptionsSection.css'
import StatsCounter from '../utils/StatsCounter'



//gives the chosen teams profile list
const TeamProfile = (TeamName, teams) => !TeamName ? [] : teams.find(t => t.TeamName === TeamName).Profiles // a team's all profiles

//sorts the profile list team profile 1st then alphabetic order 
//could move to backend all sorting (including agent & queue)
const ProfileSort = (profile, TeamName) => {
    const teamAllProfile = (TeamName !== 'ALL TEAMS') ? `ALL ${TeamName}` : 'ALL TEAMS'
    const ProfileSorter = (p1, p2) => {
        if (p1.AgentName === teamAllProfile) {
            return -1
        }
        if (p2.AgentName === teamAllProfile) {
            return 1
        }
        return p1.AgentName < p2.AgentName ? -1 : 1
    }
    return profile.sort(ProfileSorter)
}

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

const OptionsModal = ({ team, AgentProfile, profiles, teams, showModal }) => {
    const modalId = showModal ? 'show' : 'hide'
    const TeamName = !team ? 'NONE' : team
    const ProfileName = !AgentProfile ? 'NONE' : AgentProfile.AgentName
    return (
        <div className='modal-box' id={modalId} >
            <SearchList list={teams} column={1} header={`TEAM: ${TeamName}`} />
            <SearchList list={profiles} column={2} header={`PROFILE: ${ProfileName}`} />
        </div>
    )
}

const HelpModal = ({ showHelp }) => {
    const modalId = showHelp ? 'show' : 'hide'
    return (
        <div className='help-modal' id={modalId} >
            You called for me? I am here to help! Just no idea how...
        </div>
    )
}


//Options buttons div can be seperated & states moved to it
const OptionsSection = ({ OptItems }) => { //change to props?
    const [showModal, setShowModal] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    //, team, teams, setTeam, queueProfile, setQueueProfile, censor, setCensor(!censor)

    const teamFunc = (TeamName) => { //when team is changed queue profile set to new teams 'ALL' profile
        OptItems.setTeam(TeamName)
        const team = TeamProfile(TeamName, OptItems.teams)
        const profile = team.find(p => (TeamName !== 'ALL TEAMS') ? (p.AgentName === `ALL ${TeamName}`) : (p.AgentName === TeamName))
        OptItems.setQueueProfile(profile)
    }

    const teamToggle = (team) => OptItems.team !== team ? "Unselected" : "Selected" //.css use
    const teamList = OptItems.teams.map((team, index) =>
        <button id={teamToggle(team.TeamName)} key={index} onClick={() => teamFunc(team.TeamName)}>{team.TeamName}</button>
    )

    //do some wicked code to make buttons seem toggle (eg check if in filter list)
    const profileToggle = (profile) => OptItems.queueProfile.AgentId !== profile.AgentId ? "Unselected" : "Selected" //.css use
    const teamProfile = TeamProfile(OptItems.team, OptItems.teams)
    const profilesSorted = ProfileSort(teamProfile, OptItems.team)
    const profilesList = profilesSorted.map((profile, index) =>
        <button id={profileToggle(profile)} key={index} onClick={() => { OptItems.setQueueProfile(profile) }}>{profile.AgentName}</button>
    )
    const profileActivated = (profile, censor) => {
        const CensorLastname = (AgentName) => { //remove 1st part of name
            let name = [...AgentName.split(' ')]
            name.shift()
            return name.join(' ')
        }
        if (!profile) {
            return 'NONE'
        }
        if (censor) {
            return (profile.AgentName.includes('ALL') ? profile.AgentName : CensorLastname(profile.AgentName))
        }
        return profile.AgentName
    }
    const censorMode = OptItems.censor ? 'On' : 'OFF'
    //probably too many services and will have to make a modal? popup window for them.
    return (
        <div className="options-section">
            <OptionsModal team={OptItems.team} AgentProfile={OptItems.queueProfile} teams={teamList} profiles={profilesList} showModal={showModal} />
            <div className='buttons'>
                <button onClick={() => setShowModal(!showModal)}>CHOOSE FILTERS</button>
                <button onClick={() => { OptItems.setTeam(''); OptItems.setQueueProfile() }}>REMOVE FILTERS</button>
                <button onClick={OptItems.setCensor}>CENSOR: {censorMode}</button>
                <button onClick={() => setShowHelp(!showHelp)}>HELP</button>
                <HelpModal showHelp={showHelp} />
            </div>
            <div>
                <p>Team activated: {!OptItems.team ? 'NONE' : OptItems.team} | Stats: {StatsCounter.TeamStats(OptItems.report, OptItems.team, OptItems.teams)} <br></br>
                    Profile activated: {profileActivated(OptItems.queueProfile, OptItems.censor)} | Stats: {StatsCounter.ProfileStats(OptItems.report, OptItems.queueProfile)}</p>
            </div>
        </div>
    )
}

export default OptionsSection



