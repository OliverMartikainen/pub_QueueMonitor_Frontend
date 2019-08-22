const AgentFilter = ({team, agents}) => {
    if(!team) {
        return agents
    }
    return agents.filter(agent => agent.Team === team)
}

export default AgentFilter