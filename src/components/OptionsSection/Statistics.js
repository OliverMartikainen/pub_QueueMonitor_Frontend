import statsCounter from '../../utils/statsCounter'
import './Statistics.css'


const StatsCount = ({ type, stats }) => {
    return (
        <div className='stats-count'>
            <div>
                { type }: { stats.stats }
            </div>
            <div>
                { stats.ratio }
            </div>
        </div>
    )
}

const StatsRow = ({ name, statsPBX, statsEmail }) => {
    return (
        <div className='stats-row'>
            <div>
                { name }
            </div>
            <StatsCount type='Calls' stats={ statsPBX } />
            <StatsCount type='Emails' stats={ statsEmail } />
        </div>
    )
}

const Statistics = ({ teamServicesIndex, activeTeam, teams, report }) => {
    let activeTeamName = 'NONE'
    let activeTeamStatsPBX = { stats: '0/0', ratio: '' }
    let activeTeamStatsEmail = { stats: '0/0', ratio: '' }

    if (teams.length !== 0 && report?.reportPBX?.length !== 0) {
        if (activeTeam.includes('ALL TEAMS')) {
            //just count serviceId -1 stats --> report serviceId for allServices in report
            activeTeamStatsPBX = statsCounter.activeServiceIdsStats(report.reportPBX, [-1])
            activeTeamStatsEmail = statsCounter.activeServiceIdsStats(report.reportEmail, [-1])
            activeTeamName = 'ALL TEAMS'
        } else {
            //combine active teams email & pbx service ids into 1 array
            const { activeIdsPBX, activeIdsEmail } = activeTeam.reduce((activeIdsObj, teamName) => {
                const teamData = teamServicesIndex[teamName]
                if (!teamData) {
                    console.error('MISSING TEAMD SERVICE IDS FOR', teamName)
                    return activeIdsObj
                }

                return {
                    activeIdsPBX: [...activeIdsObj.activeIdsPBX, ...teamData.pbxServiceIds],
                    activeIdsEmail: [...activeIdsObj.activeIdsEmail, ...teamData.emailServiceIds]
                }
            }, { activeIdsPBX: [], activeIdsEmail: [] })

            activeTeamStatsPBX = statsCounter.activeServiceIdsStats(report.reportPBX, activeIdsPBX)
            activeTeamStatsEmail = statsCounter.activeServiceIdsStats(report.reportEmail, activeIdsEmail)
            activeTeamName = (activeTeam.length > 1) ? `${activeTeam[0]} + ${activeTeam.length - 1}` : (activeTeam[0] || 'NONE')
        }
    }

    return (
        <div className='statistics'>
            <StatsRow name={ activeTeamName } statsPBX={ activeTeamStatsPBX } statsEmail={ activeTeamStatsEmail } />
        </div>
    )
}

export default Statistics