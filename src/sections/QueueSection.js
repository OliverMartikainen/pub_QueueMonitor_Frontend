//top right

import React from 'react'
import '../style/QueueSection.css'
import Call from '../components/Call'

//for Queue sorting by wait time, works with HH:MM:SS (24h) or seconds only
const QueTimeComparer = (call1, call2) => {
    //if call1 is greater return -1, call2 return 1, equal return 0 - want longer up
    if(call1.MaxQueueTime < call2.MaxQueueTime) {
        return 1
    }
    else if(call1.MaxQueueTime > call2.MaxQueueTime) {
        return -1
    }
    //could add if equal sort by # of calls in queue
    return 0
}

const QueueSection = ({ calls }) => {
    const callsSorted = calls.sort(QueTimeComparer)

    const call_list = callsSorted.map((call, index) => <Call key={index} call={call} />)
    //ROW( CALLER-grid  #CALLS-grid  WAIT-TIME-grid)
    //would like: Time to count up, start with static

    return (
        <div className="call-section">
            <div className="call-list">
                <h2>List of phone calls NAME # TIME</h2>
                {call_list}
            </div>
        </div>
    )
}

export default QueueSection