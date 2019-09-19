import React from 'react'
import './AgentGrid.css'

const Agent = ({ agent }) => {
    const time = new Date(1000 * agent.Duration).toISOString().substr(11, 8)
    return (
        <div className='Agent' id={agent.status}>
            <div className='AgentName'>{agent.AgentName}</div>
            <div className='AgentStatus'>{agent.Reason} {time}</div>
        </div>
    )
}

const AgentGrid = ({ agents }) => {
    const agentList = agents.map((agent, index) => <Agent key={index} agent={agent} />)

    return (
        <div className='AgentGrid'>
            {agentList}
        </div>
    )
}

export default AgentGrid