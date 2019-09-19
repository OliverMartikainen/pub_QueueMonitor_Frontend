import React from 'react'
import './AgentSection.css'
import AgentGrid from './AgentSection/AgentGrid'
import StatusBoard from './AgentSection/StatusBoard'


//agents have NAME REASON TIME - added status

const AgentSection = ({ agents }) => {
    const free = ['Login', 'Sisäänkirjaus']
    const reserved = ['JÄLKIKIRJAUS', 'PUHELU (Sisään)', 'PUHELU (Ulos)', 'SÄHKÖPOSTI (Sisään)', 'SÄHKÖPOSTI (Ulos)', 'WRAPUP TIME', 'CALL (In)', 'CALL (Out)']

    const reducer = (statusCount, agent) => {
        statusCount.total++
        if (free.includes(agent.Reason)) {
            statusCount.free++
            agent.status = 'free'
            return statusCount
        }
        if (reserved.includes(agent.Reason)) {
            statusCount.reserved++
            agent.status = 'reserved'
            return statusCount
        }
        agent.status = 'busy'
        statusCount.busy++
        return statusCount
    }

    const statusCount = agents.reduce(reducer, { free: 0, reserved: 0, busy: 0, total: 0 })


    return (
        <div className='agent-section'>
            <div className='container'>
                <StatusBoard statusCount={statusCount} />
                <div className='agent-container'>
                    <AgentGrid agents={agents} />
                </div>
            </div>

        </div>
    )
}

export default AgentSection