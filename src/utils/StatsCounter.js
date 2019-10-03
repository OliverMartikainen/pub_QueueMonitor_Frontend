const ProfileStats = (report, profile) => {
    const reducer = (stats, report) => {
        if (profile.ServiceIds.includes(report.ServiceId)) {
            stats.Answered += report.ProcessedPieces
            stats.Received += report.ContactsPieces
        }
        return stats
    }
    const stats = report.reduce(reducer, { 'Answered': 0, 'Received': 0 })
    const numbs = `${stats.Answered}/${stats.Received}`
    const ratio = `${Math.round(stats.Answered / stats.Received * 100)} %`
    return ({
        stats: numbs,
        ratio: (ratio !== 'NaN %') ? ratio : '100 %'
    })
}

const TeamStats = (report, activeTeam, activeTeamProfiles) => {
    const oneTeamResults = (teamName) => {
        const teamAllProfileName = (teamName !== 'ALL TEAMS') ? `ALL ${teamName}` : 'ALL TEAMS'
        const teamAllProfile = activeTeamProfiles.find(profile => profile.AgentName === teamAllProfileName)
        return ProfileStats(report, teamAllProfile)
    }
    if(activeTeam.includes('ALL TEAMS')) {
        return oneTeamResults('ALL TEAMS')
    }
    //still needs work
    return ProfileStats(activeTeam[0])

}


export default { TeamStats, ProfileStats }