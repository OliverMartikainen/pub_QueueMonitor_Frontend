import React, { useState, useEffect } from 'react'

import AgentSection from './Dashboard/AgentSection'
import QueueSection from './Dashboard/QueueSection'


const Dashboard = ({ queue, activeAlarms, agents, censor }) => {
    const [gridColumns, setGridColumns] = useState('50% 50%')

    const gridStyle = { gridTemplateColumns: gridColumns }
    return (
        <div id='dashboard' style={gridStyle}>
            <QueueSection queue={queue} activeAlarms={activeAlarms} />
            <AgentSection agents={agents} censor={censor} />
        </div>
    )
}

export default Dashboard