const profileStats = (report, ServiceIds) => {
    const reducer = (stats, report) => {
        if (ServiceIds.includes(report.ServiceId)) {
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

const teamStats = (report, activeTeam, activeTeamProfiles) => {
    const oneTeamAllProfiles = (teamName) => {
        const teamAllProfileName = (teamName !== 'ALL TEAMS') ? `ALL ${teamName}` : 'ALL TEAMS'
        const teamAllProfile = activeTeamProfiles.find(profile => profile.AgentName === teamAllProfileName)
        return teamAllProfile.ServiceIds
    }

    if (activeTeam.includes('ALL TEAMS')) {
        return profileStats(report, oneTeamAllProfiles('ALL TEAMS'))
    }
    const combinedSerivceIds = []
    activeTeam.forEach(teamName => {
        const allProfile = oneTeamAllProfiles(teamName)
        combinedSerivceIds.push(...allProfile)
    })
    return profileStats(report, combinedSerivceIds)

}

export default { teamStats, profileStats }