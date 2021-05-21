const activeServiceIdsStats = (report, ServiceIds) => {
    const reducer = (stats, report) => {
        if (ServiceIds.includes(report.ServiceId)) {
            stats.Answered += report.ProcessedPieces
            stats.Received += report.ContactsPieces
        }
        return stats
    }
    const stats = report.reduce(reducer, { 'Answered': 0, 'Received': 0 })
    const numbs = `${stats.Answered}/${stats.Received}`
    const ratio = `${Math.round(stats.Answered / stats.Received * 100)}%`
    return ({
        stats: numbs,
        ratio: (ratio !== 'NaN%') ? ratio : ''
    })
}

export default { activeServiceIdsStats }