import React from 'react'
import './QueueHeader.css'


const QueueHeader = () => {

    return (
        <div className='queue-header'>
            <div>SERVICE NAME</div>
            <div>TYPE</div>
            <div>#</div>
            <div>WAIT</div>
        </div>
    )
}

export default QueueHeader