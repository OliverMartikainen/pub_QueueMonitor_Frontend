import React from 'react'
import StatsCounter from '../../utils/StatsCounter'
import './Statistics.css'

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
        <div className='statistics'>
            <div className='stat-row'>
                <div>
                    Team activated:
                </div>
                <div>
                {activeTeamName}
                </div>
                <div>
                    Stats: {activeTeamStats}
                </div>
            </div>
            <div className='stat-row'>
                <div>
                    Profile activated:
                </div>
                <div>
                {activeProfileName}
                </div>
                <div>
                    Stats: {activeProfileStats}
                </div>
            </div>
        </div>
    )
}

export default Statistics