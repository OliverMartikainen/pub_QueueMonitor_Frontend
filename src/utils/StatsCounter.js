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
    const oneTeamAllProfiles = (teamName) => {
        const teamAllProfileName = (teamName !== 'ALL TEAMS') ? `ALL ${teamName}` : 'ALL TEAMS'
        const teamAllProfile = activeTeamProfiles.find(profile => profile.AgentName === teamAllProfileName)
        return teamAllProfile
    }

    if (activeTeam.includes('ALL TEAMS')) {
        return ProfileStats(report, oneTeamAllProfiles('ALL TEAMS'))
    }

    const combinedProfile = {ServiceIds: []}
        activeTeam.forEach(teamName => {
        const allProfile = oneTeamAllProfiles(teamName)
        combinedProfile.ServiceIds.push(...allProfile.ServiceIds)
    })

    return ProfileStats(report, combinedProfile)

}


export default { TeamStats, ProfileStats }