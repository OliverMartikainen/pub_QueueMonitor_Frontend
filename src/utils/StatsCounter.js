const ProfileStats = (report, profile) => {
    if(!report || !profile) {
        return 'CHOOSE TEAM'
    }
    const reducer = (stats, report) => {
        if(profile.ServiceIds.includes(report.ServiceId)) {
            stats.Answered += report.ProcessedPieces
            stats.Received += report.ContactsPieces
        }
        return stats
    }
    const stats = report.reduce(reducer, {'Answered' : 0, 'Received' : 0})
    return `${stats.Answered}/${stats.Received}`
}


//needs a change once backend ALL_TEAM_Profiles is done
const TeamStats = (report, Team, teams) => {
    if(!Team) {
        return 'CHOOSE TEAM'
    }
    const profile = teams.find(team => team.TeamName === Team).Profiles.find(profile => profile.AgentName === 'ALL')
    return ProfileStats(report, profile)
}


export default {TeamStats, ProfileStats}