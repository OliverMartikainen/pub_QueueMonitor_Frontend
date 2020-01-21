import React, { useState } from 'react'
import './ServicesModal.css'
import filterUtils from '../../utils/filterUtils'
import { changeActiveAlarms } from '../../events/buttonEvents'

const AlarmOptionButtons = ({ ServiceAlarmType, changeAlarmsButtonFunc }) => {
    const createButtonIds = (selectedId) => {
        const template = {
            0: 'Unselected',
            1: 'Unselected',
            2: 'Unselected'
        }
        template[selectedId] = 'Selected'
        return template
    }
    const initialButtonIds = createButtonIds(ServiceAlarmType)

    return (
        <div>
            <button className={initialButtonIds[0]} onClick={() => { changeAlarmsButtonFunc(0) }}>Normal Alarm</button>
            <button className={initialButtonIds[1]} onClick={() => { changeAlarmsButtonFunc(1) }}>Medium Alarm</button>
            <button className={initialButtonIds[2]} onClick={() => { changeAlarmsButtonFunc(2) }}>VIP Alarm</button>
        </div>
    )
}


const ServiceListItem = ({ ServiceName, ServiceId, ServiceAlarmType, activeAlarms, setActiveAlarms }) => {
    const changeAlarmsButtonFunc = (newAlarmType) => changeActiveAlarms(ServiceId, newAlarmType, activeAlarms, setActiveAlarms)
    return (
        <div className={'service-modal-item'} >
            <div>{ServiceName} </div>
            <div>{ServiceId} </div>
            <div></div>
            <AlarmOptionButtons ServiceAlarmType={ServiceAlarmType} changeAlarmsButtonFunc={changeAlarmsButtonFunc} />
        </div>
    )
}

const ServiceList = ({ completeActiveServices, activeAlarms, setActiveAlarms }) => {
    const [filter, setFilter] = useState('')

    const handleFilter = (event) => setFilter(event.target.value)
    const stringCompare = (s1, s2) => s1.toLocaleLowerCase().includes(s2.toLocaleLowerCase())

    const filteredActiveServices = completeActiveServices.length === 0 ? [] : completeActiveServices.filter(service => stringCompare(service.ServiceName, filter))


    const filteredListItems = filteredActiveServices.map((service, index) =>
        <ServiceListItem key={index} ServiceName={service.ServiceName} ServiceId={service.ServiceId} ServiceAlarmType={service.AlarmType} activeAlarms={activeAlarms} setActiveAlarms={setActiveAlarms} />)


    return (
        <div id={'service-modal-list'} >
            <div id='service-modal-title'>
                <h3>Choose services alarm type - all active service shown</h3>
                Search: <input value={filter} onChange={handleFilter} />
            </div>
            <div id={'service-modal-search'}>
                <div className={'service-modal-item'}>
                    <div>Service Name </div>
                    <div>Service ID </div>
                    <div></div>
                    <div>ALARM TYPES</div>
                </div>
                {filteredListItems}
            </div>
        </div>
    )
}


const ServicesModal = ({ services, showModal, activeServiceIds, activeAlarms, setActiveAlarms }) => {
    if (!showModal) {
        return null
    }
    /*activeAlarms is object with ServiceId as keys, AlarmType as value */
    const addAlarmsToActives = (activeServices, activeAlarms) => {
        let newActiveServices = []

        activeServices.forEach(service => {
            const newService = {
                ServiceName: service.ServiceName,
                ServiceId: service.ServiceId,
                AlarmType: filterUtils.findServiceAlarmType(service.ServiceId, activeAlarms)
            }
            newActiveServices.push(newService)
        })
        return newActiveServices
    }

    const activeServices = filterUtils.findActiveServices(services, activeServiceIds)
    const completeActiveServices = addAlarmsToActives(activeServices, activeAlarms)
    const modalId = showModal ? 'show' : 'hide' //.css use

    return (
        <div id='service-modal-box' className={modalId} >
            <ServiceList completeActiveServices={completeActiveServices} activeAlarms={activeAlarms} setActiveAlarms={setActiveAlarms} />
        </div>
    )
}


export default ServicesModal