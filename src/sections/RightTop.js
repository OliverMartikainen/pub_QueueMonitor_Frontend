import React from 'react'
import '../style/RightTop.css'
import Agent from '../components/Agent'

//i can do this

//dynamic agent creation, this section gets an agent list
//agents have NAME STATUS TIME
//ignore offliners IF over 18, nice round number.
//STATUS changes agent styling, good luck.

const RightTop = ({ agents }) => {
    const agent_list = agents.map((agent, index) =>
        <Agent name={agent.name} status={agent.status} time={agent.time} />
    )


    return (
        <div className="right rightTop">
            <div className="agent-grid">
                {agent_list}
            </div>
            <div className="agent-grid1">
                <Agent name={"Total Free"} status={"free"} time={""} />
                <Agent name={"Total Busy"} status={"busy"} time={""} />
                <Agent name={"Total Offline"} status={"offline"} time={""} />
            </div>
        </div>
    )
}


export default RightTop