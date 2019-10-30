import React from 'react'
import vipServices from '../custom/vipServices'
import vipServicesTest from '../custom/vipServicesTest'
import './QueueSection.css'
import QueueItem from './QueueSection/QueueItem'
import QueueAlarmVIP from './QueueSection/QueueAlarmVIP'
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

const QueueList = (queue) => queue.map((item, index) => <QueueItem key={index} item={item} />)


const QueueSection = ({ queue }) => {
    let emails = []
    let calls = []
    if (queue) {
        emails = queue.filter(q => q.ContactType !== 'PBX').sort(QueueSorter)
        calls = queue.filter(q => q.ContactType === 'PBX').sort(QueueSorter)
    }

    const emailsBack = emails.length !== 0 ? '' : 'NO EMAILS'
    const callsBack = calls.length !== 0 ? '' : 'NO CALLS'

    const vipCalls = calls.filter(call => vipServices.includes(call.ServiceId))
    //const testEmails = emails.filter(email => vipServicesTest.includes(email.ServiceId))

    return (
        <div className='queue-section'>
            <div className='queue-container'>
                <QueueHeader />
                <div className='call-list'>
                    <div className='list-background '><h1>{callsBack}</h1></div>
                    <div>{QueueList(calls)}</div>
                </div>
                <div className='email-list'>
                    <div className='list-background '><h1>{emailsBack}</h1></div>
                    <div>{QueueList(emails)}</div>
                </div>
                <QueueAlarmVIP vipCalls={vipCalls} />
            </div>
        </div>
    )
}

export default QueueSection