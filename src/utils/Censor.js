const AgentsCensor = (agents) => {
    const CensorLastname = (AgentName) => { //remove 1st part of name
        let name = [...AgentName.split(' ')]
        name.shift()
        return name.join(' ')
    }

    const newList = []
    agents.forEach(agent => {
        const newAgent = {
            AgentId: agent.AgentId,
            AgentName: CensorLastname(agent.AgentName),
            Team: agent.Team,
            Reason: agent.Reason,
            Duration: agent.Duration
        }
        newList.push(newAgent)
    })
    return newList
}

const QueueCensor = (queue) => {
    const CensorService = (name) => name[0]

    const newList = []
    queue.forEach(q => {
        const newItem = {
            ServiceId: q.ServiceId,
            ServiceName: CensorService(q.ServiceName),
            ChannelId: q.ChannelId,
            ChannelName: CensorService(q.ChannelName),
            ContactType: q.ContactType,
            Direction: q.Direction,
            MaxQueueTime: q.MaxQueueTime,
            QueueLength: q.QueueLength
        }
        newList.push(newItem)
    })
    return newList
}

const Censor = (list) => {
    if (!list || list.length === 0) {
        return list
    }
    if (list[0].hasOwnProperty('ServiceId')) {
        return QueueCensor(list)
    }
    if (list[0].hasOwnProperty('AgentId')) {
        return AgentsCensor(list)
    }
    return list
}


export default Censor