import React from 'react'
import vipServices from '../custom/vipServices'
import './QueueSection.css'
import QueueItem from './QueueSection/QueueItem'
import QueueVIPItem from './QueueSection/QueueVIPItem'
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


const QueueListCalls = (queue) => {
    return queue.map((item, index) => {
        if(vipServices.includes(item.ServiceId)) {
            return <QueueVIPItem key={index} item={item} />
        } else {
            return <QueueItem key={index} item={item} />
        }
    })
}

const QueueListEmails = (queue) => queue.map((item, index) => <QueueItem key={index} item={item} />)


const QueueSection = ({ queue }) => {
    let emails = []
    let calls = []
    if (queue) {
        emails = queue.filter(q => q.ContactType !== 'PBX').sort(QueueSorter)
        calls = queue.filter(q => q.ContactType === 'PBX').sort(QueueSorter)
    }

    const emailsBack = emails.length !== 0 ? '' : 'NO EMAILS'
    const callsBack = calls.length !== 0 ? '' : 'NO CALLS'


    return (
        <div className='queue-section'>
            <div className='queue-container'>
                <QueueHeader />
                <div className='call-list'>
                    <div className='list-background '><h1>{callsBack}</h1></div>
                    <div>{QueueListCalls(calls)}</div>
                </div>
                <div className='email-list'>
                    <div className='list-background '><h1>{emailsBack}</h1></div>
                    <div>{QueueListEmails(emails)}</div>
                </div>
            </div>

        </div>
    )
}

export default QueueSection