import React from 'react'
import './AgentGrid.css'

const sizeChooser = (count) => {
    if (count < 5) {
        return 'biggest'
    }
    if (count < 11) {
        return 'big'
    }
    return 'normal' //normal fits 21 items on 3 rows
}

const Agent = ({ agent, censor }) => {
    const time = new Date(1000 * agent.Duration).toISOString().substr(11, 8)
    const agentName = !censor ? agent.AgentName : agent.AgentFirstName
    return (
        <div className='agent' id={agent.status}>
            <div className='agent-name'>{agentName}</div>
            <div className='agent-status'>{time} {agent.Reason}</div>
        </div>
    )
}

const AgentGrid = ({ agents, censor }) => {
    const size = sizeChooser(agents.length)
    console.log(size, agents.length)
    const agentList = agents.map((agent, index) => <Agent key={index} agent={agent} censor={censor} />)
    return (
        <div className={`agent-grid ${size}`} id='content'>
            {agentList}
        </div>
    )
}

export default AgentGrid