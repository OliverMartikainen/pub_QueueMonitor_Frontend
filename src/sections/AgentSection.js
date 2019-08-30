//top left

import React from 'react'
import '../style/AgentSection.css'
import Agent from '../components/Agent'

//dynamic agent creation, this section gets an agent list
//agents have NAME STATUS TIME
//can ignore offliners
//STATUS changes agent styling, good luck.

const AgentSection = ({ agents }) => {
    const agent_list = agents.map((agent, index) =>
        <Agent key={index} agent={agent} />
    )
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

    //should prob do these tests in a dev only environment? so that not in final product?

    const totalTest = statusCounter.total - agents.length
    const sectionTest = (totalTest !== 0 || statusCounter.uncategorized !== 0) ? true : false
    if (sectionTest) {
        console.log(`Agentsectuion uncategorized: ${statusCounter.uncategorized}/ total offset: ${totalTest}`)
    }
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
        <div className="agent-section">
            <div className="agent-grid">
                {agent_list}
            </div>
            <div className="agent-grid">
                <Agent agent={AgentCounters[0]} />
                <Agent agent={AgentCounters[1]} />
                <Agent agent={AgentCounters[2]} />
            </div>
        </div>
    )
}

export default AgentSection