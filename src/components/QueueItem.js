import React from 'react'

const QueueItem = ({item}) => {
    // 1.CHANNEL      2.Calls in line from channel  3.Longest wait from channel (min:sec)
    // NAME         #       MM:SS
    // Limit to length?     #       Time color coded. Own css element that changes class. yeah.
    //ChannelName ContactType QueueLength MaxQueueTime
    const time = new Date(1000 * item.MaxQueueTime).toISOString().substr(11, 8)
    return (
        <div className="queue">
            <p style={{color: "red"}}>{item.ChannelName}</p>
            <p>{item.ContactType}</p>
            <p>{item.QueueLength}</p>
            <p>{time}</p>
        </div>
    )
}

export default QueueItem