import React from 'react'
import StatsCounter from '../../utils/StatsCounter'


const profileActivated = (profile, censor) => {
    const CensorLastname = (AgentName) => { //remove 1st part of name
        let name = [...AgentName.split(' ')]
        name.shift()
        return name.join(' ')
    }
    if (!profile) {
        return 'NONE'
    }
    if (censor) {
        return (profile.AgentName.includes('ALL') ? profile.AgentName : CensorLastname(profile.AgentName))
    }
    return profile.AgentName
}

const Statistics = ({team, teams, queueProfile, report, censor}) => {
    return (
        <div>
            <p>Team activated: {!team ? 'NONE' : team} | Stats: {StatsCounter.TeamStats(report, team, teams)} <br></br>
                Profile activated: {profileActivated(queueProfile, censor)} | Stats: {StatsCounter.ProfileStats(report, queueProfile)}</p>
        </div>
    )
}

export default Statistics