const findActiveProfiles = (activeProfileIds, teams) => {
    if(teams.length === 0 || activeProfileIds.length === 0) {
        return []
    }

    const allProfiles = teams.find(t => t.TeamName === 'ALL TEAMS').Profiles
    const activeProfiles = allProfiles.filter(p => activeProfileIds.includes(p.AgentId))
    
    return activeProfiles
}


const findActiveServiceIds = (activeProfileIds, teams) => {
    if(teams.length === 0 || activeProfileIds.length === 0) {
        return []
    }

    const activeProfiles = findActiveProfiles(activeProfileIds, teams)

    const reducer = (ids, profile) => [...ids, ...profile.ServiceIds]
    const activeServiceIds = activeProfiles.reduce(reducer, [])

    return activeServiceIds
}

const findActiveServices = (services, activeServiceIds) => {
    if(services.length === 0 || activeServiceIds.length === 0) {
        return []
    }
    const activeServices = services.filter(service => activeServiceIds.includes(service.ServiceId))
    return activeServices
}

const findActiveServicesNames = (services, activeServiceIds) => {
    if(services.length === 0 || activeServiceIds.length === 0) {
        return []
    }

    const activeServices = findActiveServices(services, activeServiceIds)
    const activeServiceNames = activeServices.map(service => service.ServiceName)
    return activeServiceNames
}

const findActiveTeamProfiles = (activeTeam, teams) => {
    const oneTeamProfiles = (searchedTeam) => (teams.length === 0) ? [] : teams.find(team => team.TeamName === searchedTeam).Profiles
    let activeProfilesList = []
    activeTeam.forEach(team => {
        activeProfilesList.push(...oneTeamProfiles(team))
    })
    return activeProfilesList
}


const findActiveQueueItems = (queue, activeProfileIds, teams) => {
    const activeServiceIds = findActiveServiceIds(activeProfileIds, teams)

    const activeQueueItems = queue.filter(q => activeServiceIds.includes(q.ServiceId))
    return activeQueueItems
}

const findActiveAgents = (agents, activeTeam) => {
    const activeAgents = activeTeam.includes('ALL TEAMS') ? agents : agents.filter(agent => activeTeam.includes(agent.Team))
    return activeAgents
}

/* return Int, 0 is default alarm*/
const findServiceAlarmType = (ServiceId, activeAlarms) => {
    const serviceAlarmType = activeAlarms[ServiceId]
    if(serviceAlarmType === undefined) {
        return 0
    }
    return serviceAlarmType

}

export default {findServiceAlarmType, findActiveServices, findActiveServicesNames, findActiveTeamProfiles, findActiveServiceIds,
    findActiveProfiles, findActiveQueueItems, findActiveAgents}