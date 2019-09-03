import React from 'react'

const QueueItem = ({item}) => {
    // 1.CHANNEL      2.Calls in line from channel  3.Longest wait from channel (min:sec)
    // NAME         #       MM:SS
    // Limit to length?     #       Time color coded. Own css element that changes class. yeah.
    //ChannelName ContactType QueueLength MaxQueueTime
    const time = new Date(1000 * item.MaxQueueTime).toISOString().substr(11, 8)
    const h = Math.floor(item.MaxQueueTime/3600)
    const min = Math.floor(item.MaxQueueTime/60)-h*60
    const sec = item.MaxQueueTime-min*60-h*3600
    return (
        <div className="queue">
            <p style={{color: "red"}}>{item.ServiceName}</p>
            <p>{(item.ContactType === 'PBX' ? 'CALL' : item.ContactType)}</p>
            <p>{item.QueueLength}</p>
            <p>
            {(h < 10 ? `0${h}` : h)}:
            {(min < 10 ? `0${min}` : min)}:
            {(sec < 10 ? `0${sec}` : sec)}
            </p>
        </div>
    )
}

export default QueueItem