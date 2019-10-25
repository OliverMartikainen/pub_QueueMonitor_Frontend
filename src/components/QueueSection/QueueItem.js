import React from 'react'
import './QueueItem.css'

const QueueItem = ({item}) => {
    // NAME   TYPE     NUMB    SEC
    //ChannelName ContactType QueueLength MaxQueueTime
    const wait = item.MaxQueueTime
    const h = Math.floor(wait/3600)
    const min = Math.floor(wait/60)-h*60
    const sec = wait-min*60-h*3600
    const waitStatus = (wait) => wait < 120 ? 'green' : (wait < 600 ? 'yellow' : 'red')
    const id = item.ContactType === 'PBX' ? waitStatus(wait) : 'email' //if we want calls only

    //could replace time with just --> const time = new Date(1000 * item.MaxQueueTime).toISOString().substr(11, 8)

    return (
        <div className='queue-row'>
            <div className='service-name'>{item.ServiceName}</div>
            <div className='service-channel' id={id}>{(item.ContactType === 'PBX' ? 'CALL' : item.ContactType)}</div>
            <div className='service-length' id={id}>{item.QueueLength}</div>
            <div className='service-time' id={id}>
            {(h < 10 ? `0${h}` : h)}:
            {(min < 10 ? `0${min}` : min)}:
            {(sec < 10 ? `0${sec}` : sec)}
            </div>
        </div>
    )
}

export default QueueItem