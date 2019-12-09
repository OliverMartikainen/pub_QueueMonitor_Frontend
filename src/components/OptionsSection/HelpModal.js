import React from 'react'
import './HelpModal.css'

//ADD HELP - "f11 for fullscree, optimal for 1920x1080 100% zoom - choose x then y
// - if says b then b etc."


const HelpModal = ({ showHelp }) => {
    const modalId = showHelp ? 'show' : 'hide'
    const versionStorage = window.localStorage.getItem('serverVersion')
    return (
        <div className='help-modal' id={modalId} >
            <p>"CHOOSE FILTERS" button:
                Use it to select different filters for the CALL and EMAIL queues, and the Agents shown.
                <br></br>
                Selected PROFILE's determine the QUEUE filter.
                Selected TEAM's determine the AGENT filter.
                <br></br>
                Filter selection still under development.
            <br></br>
            <br></br>
                "REMOVE FILTERS" button:
                Use it to remove all selected filters.           
            <br></br>
                "CENSOR" button:
                Hides shows only 1st letter of Service Names and hides lastnames of Agents.
            <br></br>
                "ERROR MESSAGE/LIGHT":
                The status light is green when connection is good and everything is working.
                The status light is yellow when the browser cannot connect to the server. Either you need to change your connection or the server is down.
                The status light is red when the server cannot connect to the database. Contact admin.
            <br></br>
            version: {versionStorage}
            </p>
            
        </div>
    )
}

export default HelpModal