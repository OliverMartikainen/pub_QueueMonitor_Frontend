const ProfileStats = (report, profile) => {
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

const TeamStats = (report, activeTeam, activeTeamProfile) => {
    const teamAllProfileName = (activeTeam !== 'ALL TEAMS') ? `ALL ${activeTeam}` : 'ALL TEAMS'
    const teamAllProfile = activeTeamProfile.find(profile => profile.AgentName === teamAllProfileName)
    return ProfileStats(report, teamAllProfile)
}


export default {TeamStats, ProfileStats}