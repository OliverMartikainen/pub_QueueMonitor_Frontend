export const agentCensor = (AgentsSorted, teamProfiles) => {
    AgentsSorted.forEach(agent => {
        const agentProfile = teamProfiles.find(profile => profile.AgentId === agent.AgentId)
        agent.AgentFirstName = agentProfile.AgentFirstName
    })
    return AgentsSorted
}

export const queueCensor = (queue) => {
    const ServiceCensor = (name) => name[0]

    const newList = []
    queue.forEach(q => {
        const newItem = {
            ServiceId: q.ServiceId,
            ServiceName: ServiceCensor(q.ServiceName),
            ContactType: q.ContactType,
            MaxQueueTime: q.MaxQueueTime,
            QueueLength: q.QueueLength
        }
        newList.push(newItem)
    })
    return newList
}