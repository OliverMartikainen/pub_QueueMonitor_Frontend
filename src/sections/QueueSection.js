//top right

import React from 'react'
import '../style/QueueSection.css'
import QueueItem from '../components/QueueItem'

//for Queue sorting by wait time, works with HH:MM:SS (24h) or seconds only
const QueueSorter = (item1, item2) => {
    //if call1 is greater return -1, call2 return 1, equal return 0 - want longer up
    if (item1.MaxQueueTime < item2.MaxQueueTime) {
        return 1
    }
    else if (item1.MaxQueueTime > item2.MaxQueueTime) {
        return -1
    }
    //could add if equal sort by # of calls in queue
    return 0
}

const QueueSection = ({ queue }) => {
    const queueSorted = queue.sort(QueueSorter)
    const queue_list = queueSorted.map((item, index) => <QueueItem key={index} item={item} />)
    //ROW( CALLER-grid  #CALLS-grid  WAIT-TIME-grid)
    //would like: Time to count up, start with static

    return (
        <div className="queue-section">
            <div className="queue-list">
                <h2>List of phone calls NAME # TIME</h2>
                {queue_list}
            </div>
        </div>
    )
}

export default QueueSection