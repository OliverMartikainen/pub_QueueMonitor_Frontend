import React from 'react'


const Agent = ({ agent }) => {
    //options   FREE    BUSY    OFFLINE - not in datafeed, only test.
    const styleChooser = (reason) => {
        switch (reason) {
            case 'Total: ':
                return { backgroundColor: 'green' } //red ish
            case 'Sisäänkirjaus':
            case 'Login':
                return { backgroundColor: '#6bdaff'} //blue ish
            default:
                return { backgroundColor: '#ffa6a6'} //status statistics color
        }
    }
    let time = new Date(1000 * agent.Duration).toISOString().substr(11, 8)

    if(agent.Reason === 'Total: ') {
        time = agent.Duration
    }
    
    return (
        <div className='Agent' style={styleChooser(agent.Reason)}>
            <h3>{agent.AgentName}</h3>
            <p>{agent.Reason} {time}</p>
        </div>
    )
}

export default Agent