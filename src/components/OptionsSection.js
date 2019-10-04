import React, { useState } from 'react'
import Statistics from './OptionsSection/Statistics'
import OptionsModal from './OptionsSection/OptionModal'
import HelpModal from './OptionsSection/HelpModal'
import ErrorStatus from './OptionsSection/ErrorStatus'
import './OptionsSection.css'

//props: activeTeam, teams, changeTeam, activeProfileId, changeProfile,
//censor, setCensor(!censor), connectionStatus
const OptionsSection = ({ OptItems }) => {
    const [showOptions, setShowOptions] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    const resetFunc = () => {
        OptItems.changeTeam('') //sets activeTeam & queueProfile to ''
    }

    const censorMode = OptItems.censor ? 'On' : 'OFF'
    const optionsButtonId = !showOptions ? 'Unselected' : 'Selected'
    const helpButtonId = !showHelp ? 'Unselected' : 'Selected'
    const censorButtonId = !OptItems.censor ? 'Unselected' : 'Selected'

    const findActiveTeamProfiles = (activeTeam, teamsList) => {
        const oneTeamProfiles = (searchedTeam) => (teamsList.length === 0) ? [] : teamsList.find(team => team.TeamName === searchedTeam).Profiles
        let activeProfilesList = []
        activeTeam.forEach(team => {
            activeProfilesList.push(...oneTeamProfiles(team))
        })
        return activeProfilesList
    }
    const activeTeamProfiles = findActiveTeamProfiles(OptItems.activeTeam, OptItems.teams)

    return (
        <div className='options-section'>
            <OptionsModal activeTeamProfiles={activeTeamProfiles} activeTeam={OptItems.activeTeam} teamsList={OptItems.teams} changeTeam={OptItems.changeTeam} activeProfileId={OptItems.activeProfileId} changeProfile={OptItems.changeProfile}  showModal={showOptions} />
            <HelpModal showHelp={showHelp} />
            <div className='buttons-container'>
                <button id={optionsButtonId} onClick={() => setShowOptions(!showOptions)}>CHOOSE FILTERS</button>
                <button id={'Unselected'} onClick={() => resetFunc()}>REMOVE FILTERS</button>
                <button id={censorButtonId} onClick={OptItems.setCensor}>CENSOR: {censorMode}</button>
                <button id={helpButtonId} onClick={() => setShowHelp(!showHelp)}>HELP</button>
                <ErrorStatus error={OptItems.connectionStatus} />
            </div>
            <Statistics activeTeamProfiles={activeTeamProfiles} activeTeam={OptItems.activeTeam} teams={OptItems.teams} activeProfileId={OptItems.activeProfileId} report={OptItems.report} censor={OptItems.censor}/>
        </div>
    )
}

export default OptionsSection



