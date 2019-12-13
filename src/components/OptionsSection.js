import React, { useState } from 'react'
import Statistics from './OptionsSection/Statistics'
import OptionsModal from './OptionsSection/OptionModal'
import HelpModal from './OptionsSection/HelpModal'
import ErrorStatus from './OptionsSection/ErrorStatus'
import ServicesModal from './OptionsSection/ServicesModal'
import './OptionsSection.css'
import filterUtils from '../utils/filterUtils'


  /* OptItems:
  activeTeam, teams, changeTeam, activeProfileId, changeProfile,
  services, censor, setCensor(!censor),
  connectionStatus, activeAlarms, setActiveAlarms 
   */
const OptionsSection = ({ OptItems }) => {
    const [showOptions, setShowOptions] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const [showServices, setShowServices] = useState(false)

    const resetFunc = () => {
        OptItems.changeTeam('') //sets activeTeam & queueProfile to ''
    }

    const checkIfSelected = (stateToCheck) => !stateToCheck ? 'Unselected' : 'Selected' /* Used to choose button id --> css color */
    
    const censorMode = OptItems.censor ? 'On' : 'OFF'

    const activeTeamProfiles = filterUtils.findActiveTeamProfiles(OptItems.activeTeam, OptItems.teams)

    const activeServiceIds = filterUtils.findActiveServiceIds(OptItems.activeProfileId, OptItems.teams)

    return (
        <div className='options-section'>
            <OptionsModal activeTeamProfiles={activeTeamProfiles} activeTeam={OptItems.activeTeam} teamsList={OptItems.teams} changeTeam={OptItems.changeTeam} activeProfileId={OptItems.activeProfileId} changeProfile={OptItems.changeProfile} showModal={showOptions} />
            <HelpModal showHelp={showHelp} />
            <ServicesModal services={OptItems.services} showModal={showServices} activeServiceIds={activeServiceIds} activeAlarms={OptItems.activeAlarms} setActiveAlarms={OptItems.setActiveAlarms} />
            <div className='buttons-container'>
                <button id={checkIfSelected(showOptions)} onClick={() => setShowOptions(!showOptions)}>CHOOSE FILTERS</button>
                <button id={'Unselected'} onClick={() => resetFunc()}>REMOVE FILTERS</button>
                <button id={checkIfSelected(showServices)} onClick={() => setShowServices(!showServices)}>SERVICE ALARMS</button>
                <button id={checkIfSelected(OptItems.censor)} onClick={OptItems.setCensor}>CENSOR: {censorMode}</button>
                <button id={checkIfSelected(showHelp)} onClick={() => setShowHelp(!showHelp)}>HELP</button>
                <ErrorStatus error={OptItems.connectionStatus} />
            </div>
            <Statistics activeTeamProfiles={activeTeamProfiles} activeTeam={OptItems.activeTeam} teams={OptItems.teams} report={OptItems.report} />
        </div>
    )
}

export default OptionsSection



