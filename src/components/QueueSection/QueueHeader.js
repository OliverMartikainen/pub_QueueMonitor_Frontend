import React from 'react'
import './QueueHeader.css'


const QueueHeader = () => {

    return (
        <div className='queue-header'>
            <div className='header-name'>SERVICE NAME</div>
            <div className='header-channel'>TYPE</div>
            <div className='header-length'>#</div>
            <div className='header-time'>WAIT</div>
        </div>
    )
}

export default QueueHeader