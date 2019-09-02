//top left

import React from 'react'
import '../style/AgentSection.css'
import Agent from '../components/Agent'

//dynamic agent creation, this section gets an agent list
//agents have NAME REASON TIME
//can ignore offliners?
//REASON changes agent styling, good luck.


//prob end up sorting alphabetically
const AgentSorter = (agent1, agent2) => {
    const isFree = (agent) => (agent.Reason === 'Login' || agent.Reason === 'Sisäänkirjaus') ? true : false

    const durationSort = (agent1.Duration > agent2.Duration) ? -1 : 1 //priority to higher duration
    const reasonSort = isFree(agent1) ? -1 : (isFree(agent2) ? 1 : 0) //sorts free agent higher

    return (isFree(agent1) === isFree(agent2)) ? durationSort : reasonSort
}

const AgentSection = ({ agents }) => {
    const agentsSorted = agents.sort(AgentSorter)
    const agent_list = agentsSorted.map((agent, index) => <Agent key={index} agent={agent} />)
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