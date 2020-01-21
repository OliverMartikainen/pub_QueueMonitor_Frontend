import React from 'react'
import './QueueHeader.css'


const QueueHeader = () => {

    return (
        <div id='queue-header'>
            <div id='header-name'>SERVICE NAME</div>
            <div id='header-channel'>TYPE</div>
            <div id='header-length'>#</div>
            <div id='header-time'>WAIT</div>
        </div>
    )
}

export default QueueHeader