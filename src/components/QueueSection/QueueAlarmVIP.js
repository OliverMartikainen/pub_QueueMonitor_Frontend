import React, { useState, useEffect } from 'react'
import './QueueAlarmVIP.css'
import vipAlarm from './resources/VIPAlarm.mp3'

const TimerSeconds = ({ startTime }) => {
    const [timer, setTimer] = useState(startTime) //add 1 sec to counter possible delay
    useEffect(() => {
        setTimeout(() => {
            setTimer(timer + 1)
        }, 1000)
    }, [timer])

    if (timer > 20) {
        const time = new Date(1000 * (timer - 20)).toISOString().substr(11, 8)
        return (
            <div className='timer red'>
                -{time}
            </div>
        )
    }
    
    const time = new Date(1000 * (20 - timer)).toISOString().substr(11, 8)
        return (
        <div className='timer blue'>
            {time}
        </div>
    )
}


const QueueAlarmModal = ({ count, callShown }) => {
    const [modalColor, setModalColor] = useState('alarm-yellow')
    const flasher = modalColor !== 'alarm-yellow' ? 'alarm-yellow' : 'alarm-white'

    useEffect(() => {
        setTimeout(() => {
            setModalColor(flasher)
        }, 1000)
    }, [flasher])

    const totalCalls = count + callShown.QueueLength
    const showCallCount = totalCalls > 1 ? `VIP CALLS: ${totalCalls}` : ''
    //<div className='call-counters'>{showCallCount}</div>

    return (
        <div className={`queue-alarm-modal ${modalColor}`}>
            <audio src={vipAlarm} autoPlay loop />
            <div>VIP CALL</div>
            <div className='call-name'>{callShown.ServiceName}</div>
            <TimerSeconds startTime={callShown.MaxQueueTime} />
        </div>
    )
}


const QueueAlarmVIP = ({ vipCalls }) => {
    if (vipCalls.length === 0) {
        return (
            null
        )
    }
    const count = vipCalls.length
    const firstCall = vipCalls[0]
    return (
        <QueueAlarmModal count={count} callShown={firstCall} />
    )
}


export default QueueAlarmVIP