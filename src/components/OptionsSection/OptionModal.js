import React, { useState } from 'react'
import './OptionModal.css'

//sorts the profile list team profiles 1st then alphabetic order 
const ProfileSort = (profile, activeProfileId) => {
    const ProfileSorter = (p1, p2) => {
        if (activeProfileId.includes(p1.AgentId)) {
            return -1
        }
        if (activeProfileId.includes(p2.AgentId)) {
            return 1
        }
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

}
*/

const OptionsModal = ({ activeTeamProfiles, activeTeam, teamsList, changeTeam, activeProfileId, changeProfile, showModal }) => {

    const allProfiles = teamsList.length === 0 ? [] : teamsList.find(team => team.TeamName === 'ALL TEAMS').Profiles
    const activeProfile = allProfiles.length === 0 ? [] : allProfiles.filter(p => activeProfileId.includes(p.AgentId))

    const teamToggle = (t) => activeTeam.includes(t) ? 'Selected' : 'Unselected' //.css use
    const activeTeamList = !teamsList ? [] : teamsList.map((team, index) =>
        <button id={teamToggle(team.TeamName)} key={index} onClick={() => changeTeam(team.TeamName)}>{team.TeamName}</button>
    )

    const profileToggle = (profile) => activeProfileId.includes(profile.AgentId) ? "Selected" : "Unselected" //.css use
    const profilesSorted = ProfileSort(activeTeamProfiles, activeProfileId)
    const profilesList = profilesSorted.map((profile, index) =>
        <button id={profileToggle(profile)} key={index} onClick={() => changeProfile(profile.AgentId)}>{profile.AgentName}</button>
    )

    const modalId = showModal ? 'show' : 'hide' //.css use
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