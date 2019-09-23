import React, { useState } from 'react'


//gives the chosen teams profile list

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

const OptionsModal = ({ activeTeam, teamsList, changeTeam, activeProfileId, changeProfile, showModal }) => {

    const activeTeamProfiles = (teamsList.length === 0 || !activeTeam) ? [] : teamsList.find(team => team.TeamName === activeTeam).Profiles
    const activeProfile = activeTeamProfiles.length === 0 ? [] : activeTeamProfiles.find(p => p.AgentId === activeProfileId)
    
    const teamToggle = (t) => activeTeam !== t ? 'Unselected' : 'Selected' //.css use
    const activeTeamList = !teamsList ? [] : teamsList.map((team, index) =>
        <button id={teamToggle(team.TeamName)} key={index} onClick={() => changeTeam(team.TeamName)}>{team.TeamName}</button>
    )

    const profileToggle = (profile) => activeProfileId !== profile.AgentId ? "Unselected" : "Selected" //.css use
    const profilesSorted = ProfileSort(activeTeamProfiles, activeTeam)
    const profilesList = profilesSorted.map((profile, index) =>
        <button id={profileToggle(profile)} key={index} onClick={() => changeProfile(profile.AgentId)}>{profile.AgentName}</button>
    )

    const modalId = showModal ? 'show' : 'hide'
    const TeamName = !activeTeam ? 'NONE' : activeTeam
    const ProfileName = !activeProfile ? 'NONE' : activeProfile.AgentName

    return (
        <div className='modal-box' id={modalId} >
            <SearchList list={activeTeamList} column={1} header={`TEAM: ${TeamName}`} />
            <SearchList list={profilesList} column={2} header={`PROFILE: ${ProfileName}`} />
        </div>
    )
}


export default OptionsModal