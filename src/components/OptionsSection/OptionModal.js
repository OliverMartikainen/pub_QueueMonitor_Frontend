import React, { useState } from 'react'
import './OptionModal.css'


//gives the chosen teams profile list

//sorts the profile list team profile 1st then alphabetic order 
//could move to backend all sorting (including agent & queue)
const ProfileSort = (profile, activeTeam) => {
    const ProfileSorter = (p1, p2) => {
        if (p1.AgentName === 'ALL TEAMS') {
            return -1
        }
        if (p2.AgentName === 'ALL TEAMS') {
            return 1
        }
        return p1.AgentName < p2.AgentName ? -1 : 1
    }
    return profile.sort(ProfileSorter)
}


const SearchList = ({ list, column, type, header }) => {
    const [filter, setFilter] = useState('')

    const handleFilter = (event) => setFilter(event.target.value)

    const filtered_list = !list ? list : list.filter(item => item.props.children.toLowerCase().includes(filter.toLowerCase()))
    const style = { 'gridColumn': column }
    return (
        <div className={'modal-list'} style={style} >
            <div className='modal-title'>
                <h3>{type}</h3>
                <h3>{header}</h3>
                Search: <input value={filter} onChange={handleFilter} />
            </div>
            <div className={'modal-search'}>
                {filtered_list}
            </div>
        </div>
    )
}

/*
const createTeamButtons = (activeTeam, teamsList, setTeam, setQueueProfile) => {
    const teamFunc = (TeamName) => { //when team is changed queue profile set to new teams 'ALL' profile
        setTeam(TeamName)
        const team = TeamProfile(TeamName, teamsList)
        const profile = team.find(p => (TeamName !== 'ALL TEAMS') ? (p.AgentName === `ALL ${TeamName}`) : (p.AgentName === TeamName))
        setQueueProfile(profile)
    }

    const teamToggle = (t) => activeTeam !== t ? "Unselected" : "Selected" //.css use
    const activeTeamList = !teamsList ? [] : teamsList.map((team, index) =>
        <button id={teamToggle(team.TeamName)} key={index} onClick={() => teamFunc(team.TeamName)}>{team.TeamName}</button>
    )
    return activeTeamList
}
*/

const OptionsModal = ({ activeTeamProfiles, activeTeam, teamsList, changeTeam, activeProfileId, changeProfile, showModal }) => {
    const activeProfileIdTemp = [activeProfileId]

    //const allProfiles = teamsList.length === 0 ? [] : teamsList.find(team => team.TeamName === 'ALL TEAMS')
    //const activeProfile = allProfiles.length === 0 ? [] : allProfiles.find(p => ctiveProfileId.includes(p.AgentId))
    const activeProfileExists = activeTeamProfiles.length === 0 ? [] : activeTeamProfiles.filter(p => activeProfileIdTemp.includes(p.AgentId))
    const activeProfile = !activeProfileExists ? [] : activeProfileExists

    const teamToggle = (t) => activeTeam.includes(t) ? 'Selected' : 'Unselected' //.css use
    const activeTeamList = !teamsList ? [] : teamsList.map((team, index) =>
        <button id={teamToggle(team.TeamName)} key={index} onClick={() => changeTeam(team.TeamName)}>{team.TeamName}</button>
    )

    const profileToggle = (profile) => activeProfileId !== profile.AgentId ? "Unselected" : "Selected" //.css use
    const profilesSorted = ProfileSort(activeTeamProfiles, activeTeam)
    const profilesList = profilesSorted.map((profile, index) =>
        <button id={profileToggle(profile)} key={index} onClick={() => changeProfile(profile.AgentId)}>{profile.AgentName}</button>
    )

    const modalId = showModal ? 'show' : 'hide'
    const TeamName =  activeTeam.length === 0 ? 'NONE' : (activeTeam.length > 1 ? `${activeTeam[0]} +${activeTeam.length-1}` : activeTeam[0])
    const ProfileName = activeProfile.length === 0 ? 'NONE' : (activeProfile.length > 1 ? `${activeProfile[0].AgentName} +${activeProfile.length}` : activeProfile[0].AgentName)

    return (
        <div className='modal-box' id={modalId} >
            <SearchList list={activeTeamList} column={1} type='TEAM:' header={TeamName} />
            <SearchList list={profilesList} column={2} type='PROFILE:' header={ProfileName} />
        </div>
    )
}


export default OptionsModal