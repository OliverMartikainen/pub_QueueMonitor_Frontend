const ProfileStats = (report, profile) => {
    const reducer = (stats, report) => {
        if(profile.ServiceIds.includes(report.ServiceId)) {
            stats.Answered += report.ProcessedPieces
            stats.Received += report.ContactsPieces
        }
        return stats
    }
    const stats = report.reduce(reducer, {'Answered' : 0, 'Received' : 0})
    const numbs = `${stats.Answered}/${stats.Received}`
    const ratio = `${Math.round(stats.Answered/stats.Received*100)} %`
    return ({ 
        stats: numbs,
        ratio: (ratio !== 'NaN %') ? ratio : '100 %'
    })
}

const TeamStats = (report, activeTeam, activeTeamProfile) => {
    const teamAllProfileName = (activeTeam !== 'ALL TEAMS') ? `ALL ${activeTeam}` : 'ALL TEAMS'
    const teamAllProfile = activeTeamProfile.find(profile => profile.AgentName === teamAllProfileName)
    return ProfileStats(report, teamAllProfile)
}


export default {TeamStats, ProfileStats}