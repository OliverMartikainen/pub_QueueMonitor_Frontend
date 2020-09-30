import eventService from '../services/eventService'

export const dashboardUpdater = (setQueue, setAgents, setReport, setDataUpdateStatus) => {
    let dataUpdates = eventService.getDataUpdates()
    dataUpdates.onopen = (event) => {
        const time = new Date().toISOString().substr(11, 8)
        console.log(`dataUpdates OPEN:`, time)
    }
    dataUpdates.onerror = (event) => { //happens when frontend-backend connection is down
        const time = new Date().toISOString().substr(11, 8)
        console.log(`dataUpdates ERROR: `, time)
        setDataUpdateStatus(503)
        dataUpdates.close() //without this & the setTimeout() firefox will close connection on 2nd error
        setTimeout(
            () => dashboardUpdater(setQueue, setAgents, setReport, setDataUpdateStatus)
            , 10000)
    }
    dataUpdates.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.status !== 200) {
            const time = new Date().toISOString()
            setDataUpdateStatus(data.status)
            console.log('TEAM UPDATE FAILED', data.status, time)
            return
        }
        //console.log(`dataUpdates MESSAGE: `, data.timeStamp)
        const report = {
            reportPBX: data.reportPBX,
            reportEmail: data.reportEmail
        }
        setQueue(data.queue)
        setAgents(data.agentsOnline)
        setReport(report)
        setDataUpdateStatus(200)
    }
}


//happens approx every 30min/1h - checks server version vs local storage version
export const teamUpdater = (setTeams, setServices) => {
    const teamUpdates = eventService.getTeamUpdates()
    teamUpdates.onopen = (event) => {
        const time = new Date().toISOString().substr(11, 8)
        console.log(`teamUpdates OPEN:`, time)
    }
    teamUpdates.onerror = (event) => {
        const time = new Date().toISOString().substr(11, 8)
        console.log(`teamUpdates ERROR: `, time)
        teamUpdates.close()
        setTimeout(
            () => teamUpdater(setTeams, setServices)
            , 10000)
    }
    teamUpdates.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.status !== 200) {
            const time = new Date().toISOString().substr(11, 8)
            console.log('TEAM UPDATE FAILED', data.status, time)
            return
        }

        const serverVersion = window.sessionStorage.getItem('serverVersion') //restarts on browser open if it has old version stored - could avoid with close browser actions
        if (serverVersion && (serverVersion !== data.serverVersion)) {  //if there is a stored server version compare it to data.serverVersion and refresh client if different
            console.log('New version available', data.serverVersion, 'old version:', serverVersion)
            setTimeout(() => { window.location.reload(true) }, 5000)
        }

        window.sessionStorage.setItem('serverVersion', data.serverVersion)
        setTeams(data.teams)
        setServices(data.services)
    }
}