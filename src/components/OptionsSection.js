import React, { useState } from 'react'
import Statistics from './OptionsSection/Statistics'
import OptionsModal from './OptionsSection/OptionModal'
import HelpModal from './OptionsSection/HelpModal'
import ErrorStatus from './OptionsSection/ErrorStatus'
import ServicesModal from './OptionsSection/ServicesModal'
import './OptionsSection.css'
import filterUtils from '../utils/filterUtils'


const OptionsSection = (props) => {
    const [showOptions, setShowOptions] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const [showServices, setShowServices] = useState(false)

    const {
        activeTeam, teams, changeTeam, activeProfileId, changeProfile,
        services, censor, setCensor, connectionStatus, activeAlarms,
        setActiveAlarms, report
    } = props

    const resetFunc = () => {
        changeTeam('') //sets activeTeam & queueProfile to ''
    }

    const checkIfSelected = (stateToCheck) => !stateToCheck ? 'Unselected' : 'Selected' /* Used to choose button id --> css color */

    const censorMode = censor ? 'On' : 'OFF'

    const activeTeamProfiles = filterUtils.findActiveTeamProfiles(activeTeam, teams)

    const activeServiceIds = filterUtils.findActiveServiceIds(activeProfileId, teams)

    return (
        <div id='options-section'>
            <OptionsModal activeTeamProfiles={activeTeamProfiles} activeTeam={activeTeam} teamsList={teams} changeTeam={changeTeam} activeProfileId={activeProfileId} changeProfile={changeProfile} showModal={showOptions} />
            <HelpModal showHelp={showHelp} />
            <ServicesModal services={services} showModal={showServices} activeServiceIds={activeServiceIds} activeAlarms={activeAlarms} setActiveAlarms={setActiveAlarms} />
            <div id='option-buttons-container'>
                <button className={checkIfSelected(showOptions)} onClick={() => setShowOptions(!showOptions)}>CHOOSE FILTERS</button>
                <button className={'Unselected'} onClick={() => resetFunc()}>REMOVE FILTERS</button>
                <button className={checkIfSelected(showServices)} onClick={() => setShowServices(!showServices)}>SERVICE ALARMS</button>
                <button className={checkIfSelected(censor)} onClick={setCensor}>CENSOR: {censorMode}</button>
                <button className={checkIfSelected(showHelp)} onClick={() => setShowHelp(!showHelp)}>HELP</button>
                <ErrorStatus error={connectionStatus} />
            </div>
            <Statistics activeTeamProfiles={activeTeamProfiles} activeTeam={activeTeam} teams={teams} report={report} />
        </div>
    )
}

export default OptionsSection



