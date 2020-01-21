import React from 'react'
import './QueueSection.css'
import QueueItem from './QueueSection/QueueItem'
import QueueAlarmVIP from './QueueSection/QueueAlarmVIP'
import QueueAlarmMedium from './QueueSection/QueueAlarmMedium'
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

const EmptyQueue = ({ text }) => {
    return (
        <div className='list-background'>
            {text}
        </div>
    )
}


const QueueSection = ({ queue, activeAlarms }) => {
    /* 0=Default alarm, 1=Medium alarm, 2=VIPAlarm  
        activeAlarms is object with ServiceIds as key and alarmLevel as value
    */
    let emails = []
    let calls = []
    if (queue) {
        emails = queue.filter(q => q.ContactType !== 'PBX').sort(QueueSorter)
        calls = queue.filter(q => q.ContactType === 'PBX').sort(QueueSorter)
    }

    const emailsBack = emails.length !== 0 ? null : <EmptyQueue text='NO EMAILS' />
    const callsBack = calls.length !== 0 ? null : <EmptyQueue text='NO CALLS' />

    const mediumAlarmCalls = calls.filter(call => activeAlarms[call.ServiceId] === 1)
    const vipAlarmCalls = calls.filter(call => activeAlarms[call.ServiceId] === 2)

    return (
        <div id='queue-section'>
            <div id='queue-container'>
                <QueueHeader />
                <div id='call-list'>
                    {callsBack ? callsBack : QueueList(calls)}
                </div>
                <div id='email-list'>
                    {emailsBack ? emailsBack : QueueList(emails)}
                </div>
                <QueueAlarmMedium mediumAlarmCalls={mediumAlarmCalls} />
                <QueueAlarmVIP vipCalls={vipAlarmCalls} />
            </div>
        </div>
    )
}

export default QueueSection