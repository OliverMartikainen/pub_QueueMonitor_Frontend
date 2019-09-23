import React from 'react'
import StatsCounter from '../../utils/StatsCounter'

const Statistics = ({ activeTeam, teams, activeProfileId, report, censor }) => {
    let activeProfileName = 'NONE'
    let activeTeamName = 'NONE'
    let activeProfileStats = 'CHOOSE PROFILE'
    let activeTeamStats = 'CHOOSE TEAM'
    if (teams.length !== 0 && activeTeam && activeProfileId && report) {
        const activeTeamProfile = teams.find(t => t.TeamName === activeTeam).Profiles
        const activeProfile = activeTeamProfile.find(p => p.AgentId === activeProfileId)

        activeProfileStats = StatsCounter.ProfileStats(report, activeProfile)
        activeTeamStats = StatsCounter.TeamStats(report, activeTeam, activeTeamProfile)
        activeProfileName = !censor ? activeProfile.AgentName : activeProfile.AgentFirstName //if censor on show only firstname
        activeTeamName = !activeTeam ? 'NONE' : activeTeam
    }

    return (
        <div>
            <p>Team activated: {activeTeamName} | Stats: {activeTeamStats} <br></br>
                Profile activated: {activeProfileName} | Stats: {activeProfileStats}</p>
        </div>
    )
}

export default Statistics