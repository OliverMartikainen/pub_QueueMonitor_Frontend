import React from 'react'
import './QueueAlarmMedium.css'

const MediumAlarmHeader = () => {
    return (
        <div className='medium-alarm-header'>
            <div>MEDIUM ALARM CALLS:</div>
        </div>
    )
}

const MediumAlarmItem = ({ ServiceName, MaxQueueTime }) => {
    const time = new Date(1000 * MaxQueueTime).toISOString().substr(11, 8)
    let callName = ''
    if(ServiceName.length > 14) {
        callName = ServiceName.substr(0,14) + '...'
    } else {
        callName = ServiceName
    }
    return (
        <div className='medium-alarm-row'>
            <div>{callName}</div>
            <div></div>
            <div>{time}</div>
        </div>
    )
}

const MediumAlarmModal = ({ mediumAlarmCalls }) => {
    const callsList = mediumAlarmCalls.map((call, index)=> <MediumAlarmItem key={index} ServiceName={call.ServiceName} MaxQueueTime={call.MaxQueueTime}/>)

    return (
        <div className='medium-alarm-modal'>
            <MediumAlarmHeader />
            {callsList}
        </div>
    )
}


const QueueAlarmMedium = ({ mediumAlarmCalls }) => {
    if (mediumAlarmCalls.length === 0) {
        return (
            null
        )
    }
    return (
        <MediumAlarmModal mediumAlarmCalls={mediumAlarmCalls} />
    )
}


export default QueueAlarmMedium