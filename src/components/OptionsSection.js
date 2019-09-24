import React, { useState } from 'react'
import Statistics from './OptionsSection/Statistics'
import OptionsModal from './OptionsSection/OptionModal'
import '../style/OptionsSection.css'

const HelpModal = ({ showHelp }) => {
    const modalId = showHelp ? 'show' : 'hide'
    return (
        <div className='help-modal' id={modalId} >
            You called for me? I am here to help! Just no idea how...
        </div>
    )
}


//props: activeTeam, teams, changeTeam, activeProfileId, changeProfile,
//censor, setCensor(!censor), connectionStatus
const OptionsSection = ({ OptItems }) => {
    const [showModal, setShowModal] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    const resetFunc = () => {
        OptItems.changeTeam('') //sets activeTeam & queueProfile to ''
    }

    const censorMode = OptItems.censor ? 'On' : 'OFF'

    return (
        <div className="options-section">
            <OptionsModal activeTeam={OptItems.activeTeam} teamsList={OptItems.teams} changeTeam={OptItems.changeTeam} activeProfileId={OptItems.activeProfileId} changeProfile={OptItems.changeProfile}  showModal={showModal} />
            <div className='buttons'>
                <button onClick={() => setShowModal(!showModal)}>CHOOSE FILTERS</button>
                <button onClick={() => resetFunc()}>REMOVE FILTERS</button>
                <button onClick={OptItems.setCensor}>CENSOR: {censorMode}</button>
                <button onClick={() => setShowHelp(!showHelp)}>HELP</button>
                <HelpModal showHelp={showHelp} />
                <div>{OptItems.connectionStatus.status}</div>
            </div>
            <Statistics activeTeam={OptItems.activeTeam} teams={OptItems.teams} activeProfileId={OptItems.activeProfileId} report={OptItems.report} censor={OptItems.censor}/>
        </div>
    )
}

export default OptionsSection



