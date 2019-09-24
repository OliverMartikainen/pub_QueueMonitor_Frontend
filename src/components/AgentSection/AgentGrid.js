import React from 'react'
import './AgentGrid.css'

const Agent = ({ agent, censor }) => {
    const time = new Date(1000 * agent.Duration).toISOString().substr(11, 8)
    const agentName = !censor ? agent.AgentName : agent.AgentFirstName
    return (
        <div className='Agent' id={agent.status}>
            <div className='AgentName'>{agentName}</div>
            <div className='AgentStatus'>{agent.Reason} {time}</div>
        </div>
    )
}

const AgentGrid = ({ agents, censor }) => {
    const agentList = agents.map((agent, index) => <Agent key={index} agent={agent} censor={censor} />)

    return (
        <div className='AgentGrid'>
            {agentList}
        </div>
    )
}

export default AgentGrid