import React from 'react'


const Agent = ({ agent }) => {
    //options   FREE    BUSY    OFFLINE - not in datafeed, only test.
    const styleChooser = (reason) => {
        switch (reason) {
            case 'busy':
                return { backgroundColor: '#ffa6a6' } //red ish
            case 'free':
                return { backgroundColor: '#6bdaff'} //blue ish
            case 'offline':
                return { backgroundColor: '#d6d6d6'} //gray
            default:
                return { backgroundColor: 'green'} //status statistics color
        }
    }

    return (
        <div className='Agent' style={styleChooser(agent.Reason)}>
            <h3>{agent.AgentName}</h3>
            <p>{agent.Reason} {agent.Duration}</p>
        </div>
    )
}

export default Agent