import React from 'react'
import '../style/AgentSection.css'
import Agent from '../components/Agent'

//agents have NAME REASON TIME

const AgentSection = ({ agents }) => {
    const agent_list = agents.map((agent, index) => <Agent key={index} agent={agent} />)
    //prob more stylish way to do this
    const reducer = (statusCount, agent) => {
        switch (agent.Reason) {
            case 'Login':
            case 'Sisäänkirjaus':
                statusCount.free++
                break
            default:
                statusCount.busy++
        }
        statusCount.total++
        return statusCount
    }


    const statusCounter = agents.reduce(reducer, { free: 0, busy: 0, total: 0 })

    //could rework- <div className='Agent'> 
    const AgentCounters = [
        {
            AgentName: `Free`,
            Reason: `Total: `,
            Duration: `${statusCounter.free}`
        },
        {
            AgentName: `Busy`,
            Reason: `Total: `,
            Duration: `${statusCounter.busy}`
        },
        {
            AgentName: `Total`,
            Reason: `Total: `,
            Duration: `${statusCounter.total}`
        }
    ]

    return (
        <div className='agent-section'>
            <div className='agent-container'>
                <div className='agent-grid'>
                    {agent_list}
                </div>
                <div className='agent-grid'>
                    <Agent agent={AgentCounters[0]} />
                    <Agent agent={AgentCounters[1]} />
                    <Agent agent={AgentCounters[2]} />
                </div>
            </div>
        </div>
    )
}

export default AgentSection