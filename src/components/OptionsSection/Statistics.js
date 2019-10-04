import React from 'react'
import statsCounter from '../../utils/statsCounter'
import './Statistics.css'


const StatsCount = ({ type, stats }) => {
    return (
        <div className='stats-count'>
            <div>
                {type}: {stats.stats}
            </div>
            <div>
                {stats.ratio}
            </div>
        </div>
    )
}

const StatsRow = ({ type, name, statsPBX, statsEmail }) => {
    return (
        <div className='stats-row'>
            <div>
                {type}:
            </div>
            <div>
                {name}
            </div>
            <StatsCount type='Calls' stats={statsPBX} />
            <StatsCount type='Emails' stats={statsEmail} />
        </div>
    )
}

const Statistics = ({ activeTeamProfiles, activeTeam, teams, activeProfileId, report, censor }) => {
    let activeProfileName = 'NONE'
    let activeTeamName = 'NONE'
    let activeProfileStatsPBX = '0/0'
    let activeProfileStatsEmail = '0/0'
    let activeTeamStatsPBX = '0/0'
    let activeTeamStatsEmail = '0/0'
    if (teams.length !== 0 && report) {
        if (activeTeamProfiles !== 0) {
            activeTeamStatsPBX = statsCounter.TeamStats(report.reportPBX, activeTeam, activeTeamProfiles)
            activeTeamStatsEmail = statsCounter.TeamStats(report.reportEmail, activeTeam, activeTeamProfiles)
            activeTeamName = activeTeam.length > 1 ? `${activeTeam[0]} +${activeTeam.length}` : activeTeam[0]
        }
        if (activeProfileId) {
            const allProfiles = teams.find(t => t.TeamName === 'ALL TEAMS').Profiles
            const activeProfile = allProfiles.find(p => p.AgentId === activeProfileId)

            activeProfileStatsPBX = statsCounter.ProfileStats(report.reportPBX, activeProfile)
            activeProfileStatsEmail = statsCounter.ProfileStats(report.reportEmail, activeProfile)
            activeProfileName = !censor ? activeProfile.AgentName : activeProfile.AgentFirstName //if censor on show only firstname
        }
    }


    return (
        <div className='statistics'>
            <StatsRow type='Team' name={activeTeamName} statsPBX={activeTeamStatsPBX} statsEmail={activeTeamStatsEmail} />
            <StatsRow type='Profile' name={activeProfileName} statsPBX={activeProfileStatsPBX} statsEmail={activeProfileStatsEmail} />
        </div>
    )
}

export default Statistics