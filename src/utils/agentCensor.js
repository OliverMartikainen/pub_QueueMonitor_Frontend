const agentCensor = (AgentsSorted, teamProfiles) => {
    AgentsSorted.forEach(agent => {
        const agentProfile = teamProfiles.find(profile => profile.AgentId === agent.AgentId)
        agent.AgentFirstName = agentProfile.AgentFirstName
    })
    return AgentsSorted
}

export default agentCensor