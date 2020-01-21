import React, { useState } from 'react'
import './Dashboard.css'

import AgentSection from './Dashboard/AgentSection'
import QueueSection from './Dashboard/QueueSection'

const doubleColumnStyle = '50% 50%'
const singleColumnStyle = '100%'

const defaultColumns = {
    showQueue: true,
    showAgents: true,
    gridStyle: doubleColumnStyle
}

const changeDashboard = (buttonClicked, dashColumns, setDashColumns) => {
    const newDashColumns = { ...dashColumns }
    newDashColumns[buttonClicked] = !newDashColumns[buttonClicked]
    if (!newDashColumns.showQueue || !newDashColumns.showAgents) {
        newDashColumns.gridStyle = singleColumnStyle
    } else {
        newDashColumns.gridStyle = doubleColumnStyle
    }
    try {
        window.localStorage.setItem('dashboardColumns', JSON.stringify(newDashColumns))
        setDashColumns(newDashColumns)
    } catch (error) {
        console.log('Dashboard switch failure')
        window.localStorage.removeItem('dashboardColumns')
        setDashColumns(defaultColumns)
    }
}

const initialColumns = () => {
    let storedColumns = localStorage.getItem('dashboardColumns')
    if(storedColumns) {
        try {
            const columns = JSON.parse(storedColumns)
            return columns
        } catch (error) {
            console.log('Dashboard switch failure')
            window.localStorage.removeItem('dashboardColumns')
            return defaultColumns
        }
    }
    return defaultColumns
}

const Dashboard = ({ queue, activeAlarms, agents, censor }) => {
    const [dashColumns, setDashColumns] = useState(initialColumns())

    const checkIfSelected = (stateToCheck) => !stateToCheck ? 'not-shown' : 'shown' /* Used to choose button id --> css color */

    const gridStyle = { '--grid-columns': dashColumns.gridStyle }
    const queueBtnText = dashColumns.showQueue ? 'HIDE QUEUE' : 'SHOW QUEUE'
    const agentsBtnText = dashColumns.showAgents ? 'HIDE AGENTS' : 'SHOW AGENTS'


    return (
        <div id='dashboard' style={gridStyle}>
            <div id='dashboard-options'>
                <div id='dashboard-options-modal'>
                    <button className={checkIfSelected(dashColumns.showQueue)} onClick={() => changeDashboard('showQueue', dashColumns, setDashColumns)}>
                        {queueBtnText}
                    </button>
                    <button className={checkIfSelected(dashColumns.showAgents)} onClick={() => changeDashboard('showAgents', dashColumns, setDashColumns)} >
                        {agentsBtnText}
                    </button>
                </div>
            </div>
            {dashColumns.showQueue && <QueueSection queue={queue} activeAlarms={activeAlarms} />}
            {dashColumns.showAgents && <AgentSection agents={agents} censor={censor} />}
        </div>
    )
}

export default Dashboard