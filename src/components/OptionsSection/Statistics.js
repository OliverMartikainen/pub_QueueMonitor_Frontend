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
                {name}
            </div>
            <StatsCount type='Calls' stats={statsPBX} />
            <StatsCount type='Emails' stats={statsEmail} />
        </div>
    )
}

const Statistics = ({ activeTeamProfiles, activeTeam, teams, report }) => {
    let activeTeamName = 'NONE'
    let activeTeamStatsPBX = '0/0'
    let activeTeamStatsEmail = '0/0'

    if (teams.length !== 0 && report && report.reportPBX.length !== 0) {
        if (activeTeamProfiles.length !== 0) {
            activeTeamStatsPBX = statsCounter.teamStats(report.reportPBX, activeTeam, activeTeamProfiles)
            activeTeamStatsEmail = statsCounter.teamStats(report.reportEmail, activeTeam, activeTeamProfiles)
            activeTeamName = activeTeam.length > 1 ? `${activeTeam[0]} +${activeTeam.length-1}` : activeTeam[0]
        }
    }

    return (
        <div className='statistics'>
            <StatsRow type='Team' name={activeTeamName} statsPBX={activeTeamStatsPBX} statsEmail={activeTeamStatsEmail} />
         </div>
    )
}

export default Statistics