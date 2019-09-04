//top right

import React from 'react'
import '../style/QueueSection.css'
import QueueItem from '../components/QueueItem'

//for Queue sorting by wait time, works with HH:MM:SS (24h) or seconds only
const QueueSorter = (item1, item2) => { //item1.MaxQueueTime < item2.MaxQueuetime ? 1 : -1
    //if call1 is greater return -1, call2 return 1, equal return 0 - want longer up
    if (item1.MaxQueueTime < item2.MaxQueueTime) {
        return 1
    }
    else if (item1.MaxQueueTime > item2.MaxQueueTime) {
        return -1
    }
    return 0
}

const QueueList = (queue) => {
    const queueSorted = queue.sort(QueueSorter)
    return queueSorted.map((item, index) => <QueueItem key={index} item={item} />)
}

const QueueSection = ({ queue }) => {
    const emails = queue.filter(q => q.ContactType !== 'PBX')
    const calls = queue.filter(q => q.ContactType === 'PBX')

    //would like: Time to count up, start with static

    const emailsBack = emails.length !== 0 ? '' : 'NO EMAILS'
    const callsBack = calls.length !== 0 ? '' : 'NO CALLS'


    return (
        <div className='queue-section'>
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