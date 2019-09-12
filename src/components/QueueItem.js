import React from 'react'

const QueueItem = ({item}) => {
    // NAME   TYPE     NUMB    SEC
    //ChannelName ContactType QueueLength MaxQueueTime
    const wait = item.MaxQueueTime
    const h = Math.floor(wait/3600)
    const min = Math.floor(wait/60)-h*60
    const sec = wait-min*60-h*3600
    const waitStatus = (wait) => wait < 120 ? 'green' : (wait < 600 ? 'yellow' : 'red')
    const id = item.ContactType === 'PBX' ? waitStatus(wait) : 'email' //if we want calls only
    return (
        <div className="queue-row">
            <p style={{'color': 'rgb(100, 0, 0)', 'fontWeight':'600'}}>{item.ServiceName}</p>
            <p>{(item.ContactType === 'PBX' ? 'CALL' : item.ContactType)}</p>
            <p>{item.QueueLength}</p>
            <p id={id}>
            {(h < 10 ? `0${h}` : h)}:
            {(min < 10 ? `0${min}` : min)}:
            {(sec < 10 ? `0${sec}` : sec)}
            </p>
        </div>
    )
}

export default QueueItem