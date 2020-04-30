

//chanceProfile & changeTeam are button functions used in OptionsSection & OptionsModal components
export const changeProfileFunc = (newProfile, activeProfileId, setQueueProfile) => { //newProfile is Int
    const doProfileChange = (newProfileFilter) => {
        window.localStorage.setItem('activeProfileId', newProfileFilter.toString())
        setQueueProfile(newProfileFilter)
    }
    const addProfile = () => [...activeProfileId, newProfile]
    const removeProfile = () => activeProfileId.filter(id => id !== newProfile)

    if (newProfile === '') {
        doProfileChange([])
        return
    }
    if (activeProfileId.includes(1)) { /*1 === 'ALL TEAMS' profile */
        if (newProfile === 1) {
            doProfileChange([])
            return
        }
        doProfileChange([newProfile])
        return
    }
    if (newProfile === 1) {
        doProfileChange([newProfile])
        return
    }
    const newProfileFilter = activeProfileId.includes(newProfile) ? removeProfile() : addProfile()
    doProfileChange(newProfileFilter)
}

export const changeTeamFunc = (newTeam, activeTeam, setActiveTeam, changeProfile) => { //newTeam is String
    const doTeamChange = (newTeamFilter) => {
        window.localStorage.setItem('activeTeam', newTeamFilter.toString())
        setActiveTeam(newTeamFilter)
    }
    const addTeam = () => [...activeTeam, newTeam]
    const removeTeam = () => activeTeam.filter(teamName => teamName !== newTeam)

    if (newTeam === '') {
        changeProfile('')
        doTeamChange([])
        return
    }
    if (activeTeam.includes('ALL TEAMS')) {
        if (newTeam === 'ALL TEAMS') {
            doTeamChange([])
            return
        }
        doTeamChange([newTeam])
        return
    }
    if (newTeam === 'ALL TEAMS') { //avoids duplicate profiles list - room for rework in whole 'teams' listing.
        doTeamChange([newTeam])
        return
    }
    const newTeamFilter = activeTeam.includes(newTeam) ? removeTeam() : addTeam()
    doTeamChange(newTeamFilter)
}


export const changeActiveAlarms = (ServiceId, newAlarmType, activeAlarms, setActiveAlarms) => {
    const createNewActiveAlarms = (ServiceId, newAlarmType, activeAlarms) => {
        /* activeAlarms is object with SerivceId as key */
        if (newAlarmType === 0) {
            delete activeAlarms[ServiceId]
            const newActiveAlarms = { ...activeAlarms }
            return newActiveAlarms
        }
        activeAlarms[ServiceId] = newAlarmType
        const newActiveAlarms = { ...activeAlarms }
        return newActiveAlarms
    }
    const newActiveAlarms = createNewActiveAlarms(ServiceId, newAlarmType, activeAlarms)
    window.localStorage.setItem('activeAlarms', JSON.stringify(newActiveAlarms))
    setActiveAlarms(newActiveAlarms)
}