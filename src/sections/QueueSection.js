//top right

import React from 'react'
import '../style/QueueSection.css'
import QueueItem from '../components/QueueItem'

//for Queue sorting by wait time, works with HH:MM:SS (24h) or seconds only
//automatically in db in this order?
const QueueSorter = (item1, item2) => item1.MaxQueueTime < item2.MaxQueuetime ? -1 : 1


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