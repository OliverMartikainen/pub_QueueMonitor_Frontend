//top right

import React from 'react'
import './QueueSection.css'
import QueueItem from './QueueSection/QueueItem'
import QueueHeader from './QueueSection/QueueHeader'


//for Queue sorting by wait time, works with HH:MM:SS (24h) or seconds only
//automatically in db in this order?
const QueueSorter = (item1, item2) => {
    if (item1.MaxQueueTime < item2.MaxQueueTime) {
        return 1
    }
    if (item1.MaxQueueTime > item2.MaxQueueTime) {
        return -1
    }
    return 0
}


const QueueList = (queue) => {
    return queue.map((item, index) => <QueueItem key={index} item={item} />)
}

const QueueSection = ({ queue }) => {
    let emails = []
    let calls = []
    if (queue) {
        emails = queue.filter(q => q.ContactType !== 'PBX').sort(QueueSorter)
        calls = queue.filter(q => q.ContactType === 'PBX').sort(QueueSorter)
    }

    //would like: Time to count up, start with static

    const emailsBack = emails.length !== 0 ? '' : 'NO EMAILS'
    const callsBack = calls.length !== 0 ? '' : 'NO CALLS'


    return (
        <div className='queue-section'>
            <QueueHeader />
            <div className='call-list'>
                <div id='background'><h1>{callsBack}</h1></div>
                <div id='content'>{QueueList(calls)}</div>
            </div>
            <div className='email-list'>
                <div id='background'><h1>{emailsBack}</h1></div>
                <div id='content'>{QueueList(emails)}</div>
            </div>
        </div>
    )
}

export default QueueSection