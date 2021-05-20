import eventService from '../services/eventService'

export const dashboardUpdater = (setDasboardStates, setDataUpdateStatus) => {
    const dataUpdates = eventService.getDataUpdates()

    dataUpdates.onopen = () => {
        const time = new Date().toISOString().substr(11, 8)
        console.log('dataUpdates OPEN:', time)
    }

    dataUpdates.onerror = () => { //happens when frontend-backend connection is down
        const time = new Date().toISOString().substr(11, 8)
        console.log('dataUpdates ERROR: ', time)
        setDataUpdateStatus(503)
        dataUpdates.close() //without this & the setTimeout() firefox will close connection on 2nd error
        setTimeout(() => dashboardUpdater(setDasboardStates, setDataUpdateStatus), 10*1000)
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

            setDasboardStates({
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
    return dataUpdates
}


//happens approx every 30min/1h - checks server version vs local storage version
export const teamUpdater = (setTeamStates) => {
    const teamUpdates = eventService.getTeamUpdates()

    teamUpdates.onopen = () => {
        const time = new Date().toISOString().substr(11, 8)
        console.log('teamUpdates OPEN:', time)
    }

    teamUpdates.onerror = () => {
        const time = new Date().toISOString().substr(11, 8)
        console.log('teamUpdates ERROR: ', time)
        //close current connection on error and try to reconnect in 10 sec
        teamUpdates.close()
        setTimeout(() => teamUpdater(setTeamStates), 10 * 1000)
    }

    teamUpdates.onmessage = (event) => {
        try {
            // { serverVersion: String, teams: Array, services: Array, status: Number, teamServicesIndex: Object, timeStamp: String }
            const data = JSON.parse(event.data)

            if (data.status !== 200) {
                const time = new Date().toISOString().substr(11, 8)
                console.log('TEAM UPDATE FAILED', data.status, time)
                return
            }

            //reload page if active browser app version is older than what backend reports current version should be
            const serverVersion = window.sessionStorage.getItem('serverVersion')
            if (serverVersion && (serverVersion !== data.serverVersion)) {
                console.log('New version available', data.serverVersion, 'old version:', serverVersion)
                setTimeout(() => { window.location.reload() }, 5000)
            }

            window.sessionStorage.setItem('serverVersion', data.serverVersion)
            setTeamStates({ teams: data.teams, services: data.services, teamServicesIndex: data.teamServicesIndex })
        } catch (error) {
            console.error(error)
        }
    }
    return teamUpdates
}