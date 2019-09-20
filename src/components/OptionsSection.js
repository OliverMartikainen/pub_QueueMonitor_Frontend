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

//props: team, teams, setTeam, queueProfile, setQueueProfile, censor, setCensor(!censor)
const OptionsSection = ({ OptItems }) => { //change to props?
    const [showModal, setShowModal] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    const censorMode = OptItems.censor ? 'On' : 'OFF'


    return (
        <div className="options-section">
            <OptionsModal activeTeam={OptItems.activeTeam} teamsList={OptItems.teams} setTeam={OptItems.setTeam} activeProfileId={OptItems.activeProfileId} setQueueProfile={OptItems.setQueueProfile}  showModal={showModal} />
            <div className='buttons'>
                <button onClick={() => setShowModal(!showModal)}>CHOOSE FILTERS</button>
                <button onClick={() => { OptItems.setTeam(''); OptItems.setQueueProfile() }}>REMOVE FILTERS</button>
                <button onClick={OptItems.setCensor}>CENSOR: {censorMode}</button>
                <button onClick={() => setShowHelp(!showHelp)}>HELP</button>
                <HelpModal showHelp={showHelp} />
            </div>
            <Statistics team={OptItems.activeTeam} teams={OptItems.teams} activeProfileServiceIds={OptItems.activeProfileId} report={OptItems.report} censor={OptItems.censor}/>
        </div>
    )
}

export default OptionsSection



