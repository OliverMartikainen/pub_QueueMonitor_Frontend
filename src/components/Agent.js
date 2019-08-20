import React from 'react'
import '../style/Agent.css'


const Agent = ({ name, status, time }) => {
    //format time elsewhere? if shown in minutes no need to update, who cares for seconds.
    //time format: 06h 50min

    //options   FREE    BUSY    OFFLINE
    const styleChooser = (status) => {
        switch (status) {
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
        <div className='Agent' style={styleChooser(status)}>
            <h3>{name}</h3>
            <p>{status} {time}</p>
        </div>
    )
}

export default Agent