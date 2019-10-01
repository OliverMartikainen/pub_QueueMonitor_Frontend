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

const StatsRow = ({type, name, statsPBX, statsEmail}) => {

    return (
        <div className='stats-row'>
            <div>
                {type}:
            </div>
            <div>
                {name}
            </div>
            <StatsCount type='Calls' stats={statsPBX}/>
            <StatsCount type='Emails' stats={statsEmail}/>
        </div>
    )
}

const Statistics = ({ activeTeam, teams, activeProfileId, report, censor }) => {
    let activeProfileName = 'NONE'
    let activeTeamName = 'NONE'
    let activeProfileStatsPBX = '0/0'
    let activeProfileStatsEmail = '0/0'
    let activeTeamStatsPBX = '0/0'
    let activeTeamStatsEmail = '0/0'
    if (teams.length !== 0 && activeTeam && activeProfileId && report) {
        const activeTeamProfile = teams.find(t => t.TeamName === activeTeam).Profiles
        const activeProfile = activeTeamProfile.find(p => p.AgentId === activeProfileId)

        activeProfileStatsPBX = statsCounter.ProfileStats(report.reportPBX, activeProfile)
        activeProfileStatsEmail = statsCounter.ProfileStats(report.reportEmail, activeProfile)
        activeTeamStatsPBX = statsCounter.TeamStats(report.reportPBX, activeTeam, activeTeamProfile)
        activeTeamStatsEmail = statsCounter.TeamStats(report.reportEmail, activeTeam, activeTeamProfile)
        activeProfileName = !censor ? activeProfile.AgentName : activeProfile.AgentFirstName //if censor on show only firstname
        activeTeamName = !activeTeam ? 'NONE' : activeTeam
    }

    return (
        <div className='statistics'>
            <StatsRow type='Team' name={activeTeamName} statsPBX={activeTeamStatsPBX} statsEmail={activeTeamStatsEmail}/>
            <StatsRow type='Profile' name={activeProfileName} statsPBX={activeProfileStatsPBX} statsEmail={activeProfileStatsEmail}/>
        </div>
    )
}

export default Statistics