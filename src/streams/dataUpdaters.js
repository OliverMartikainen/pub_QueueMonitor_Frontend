import eventService from '../services/eventService'

export const dashboardUpdater = (setDasboardData, setDataUpdateStatus) => {
    let dataUpdates = eventService.getDataUpdates()
    dataUpdates.onopen = () => {
        const time = new Date().toISOString().substr(11, 8)
        console.log('dataUpdates OPEN:', time)
    }
    dataUpdates.onerror = () => { //happens when frontend-backend connection is down
        const time = new Date().toISOString().substr(11, 8)
        console.log('dataUpdates ERROR: ', time)
        setDataUpdateStatus(503)
        dataUpdates.close() //without this & the setTimeout() firefox will close connection on 2nd error
        setTimeout(
            () => dashboardUpdater(setDasboardData, setDataUpdateStatus)
            , 10000)
    }
    dataUpdates.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)

            if (data.status !== 200) {
                const time = new Date().toISOString()
                setDataUpdateStatus(data.status)
                console.log('TEAM UPDATE FAILED', data.status, time)
                return
            }

            setDasboardData({
                agents: data.agentsOnline,
                queue: data.queue,
                report: {
                    reportPBX: data.reportPBX,
                    reportEmail: data.reportEmail
                }
            })

            setDataUpdateStatus(200)

        } catch (error) {
            console.error(error)
        }
    }
}


//happens approx every 30min/1h - checks server version vs local storage version
export const teamUpdater = (setTeams, setServices) => {
    const teamUpdates = eventService.getTeamUpdates()
    teamUpdates.onopen = () => {
        const time = new Date().toISOString().substr(11, 8)
        console.log('teamUpdates OPEN:', time)
    }
    teamUpdates.onerror = () => {
        const time = new Date().toISOString().substr(11, 8)
        console.log('teamUpdates ERROR: ', time)
        teamUpdates.close()
        setTimeout(
            () => teamUpdater(setTeams, setServices)
            , 10000)
    }
    teamUpdates.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)

            if (data.status !== 200) {
                const time = new Date().toISOString().substr(11, 8)
                console.log('TEAM UPDATE FAILED', data.status, time)
                return
            }

            const serverVersion = window.sessionStorage.getItem('serverVersion') //restarts on browser open if it has old version stored - could avoid with close browser actions
            if (serverVersion && (serverVersion !== data.serverVersion)) {  //if there is a stored server version compare it to data.serverVersion and refresh client if different
                console.log('New version available', data.serverVersion, 'old version:', serverVersion)
                setTimeout(() => { window.location.reload() }, 5000)
            }

            window.sessionStorage.setItem('serverVersion', data.serverVersion)
            setTeams(data.teams)
            setServices(data.services)
        } catch (error) {
            console.error(error)
        }
    }
}