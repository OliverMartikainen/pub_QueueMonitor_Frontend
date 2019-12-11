import React from 'react'
import './AgentSection.css'
import AgentGrid from './AgentSection/AgentGrid'
import AgentHeader from './AgentSection/AgentHeader'
import AgentReasonGroups from '../custom/AgentReasonGroups'

const AgentSection = ({ agents, censor }) => {
    const free = AgentReasonGroups.free
    const call = AgentReasonGroups.call

    const reducer = (statusCount, agent) => {
        statusCount.total++
        if (free.includes(agent.Reason)) {
            statusCount.free++
            agent.status = 'free'
            return statusCount
        }
        if (call.includes(agent.Reason)) {
            statusCount.call++
            agent.status = 'call'
            return statusCount
        }
        agent.status = 'busy'
        statusCount.busy++
        return statusCount
    }

    const statusCount = agents.reduce(reducer, { free: 0, call: 0, busy: 0, total: 0 })
    const agentsBack = agents.length !== 0 ? '' : 'NO AGENTS ONLINE' 
    return (
        <div className='agent-section'>
            <div className='agent-container'>
                <AgentHeader statusCount={statusCount} />
                <div className='agent-list'>
                    <AgentGrid agents={agents} censor={censor} />
                    <div className='agent-background'>{agentsBack}</div>
                </div>
            </div>
        </div>
    )
}

export default AgentSection