import React from 'react'

const Call = ({call}) => {
    // 1.CHANNEL      2.Calls in line from channel  3.Longest wait from channel (min:sec)
    // NAME         #       MM:SS
    // Limit to length?     #       Time color coded. Own css element that changes class. yeah.
    //ChannelName ContactType QueueLength MaxQueueTime
    const time = new Date(1000 * call.MaxQueueTime).toISOString().substr(11, 8)
    return (
        <div className="call">
            <p style={{color: "red"}}>{call.ChannelName}</p>
            <p>{call.ContactType}</p>
            <p>{call.QueueLength}</p>
            <p>{time}</p>
        </div>
    )
}

export default Call