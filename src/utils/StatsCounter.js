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
const TeamStats = (report, team, teams) => {
    if(!team || teams.length === 0) {
        return 'CHOOSE TEAM'
    }
    const teamProfiles = teams.find(t => t.TeamName === team).Profiles
    const teamAllProfile = teamProfiles.find(profile => 
        profile.AgentName === ((team !== 'ALL TEAMS') ? `ALL ${profile.TeamName}` : team))
    return ProfileStats(report, teamAllProfile)
}


export default {TeamStats, ProfileStats}