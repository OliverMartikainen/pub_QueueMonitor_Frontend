import React from 'react'
import './HelpModal.css'

//ADD HELP - "f11 for fullscree, optimal for 1920x1080 100% zoom - choose x then y
// - if says b then b etc."


const HelpModal = ({ showHelp }) => {
    const modalId = showHelp ? 'show' : 'hide'
    const versionStorage = window.localStorage.getItem('serverVersion')
    return (
        <div className='help-modal' id={modalId} >
            <p>Help unavailable at the moment.
            <br></br>
            <br></br>
            <br></br>
            If you have suggestions or encounter errors/problems contact:
            <br></br>
            <br></br>
            Email oliver.martikainen@cgi.com, Subject: QueueMonitor
            <br></br>
            or
            <br></br>
            Email markus.ruotsalainen@cgi.com
            
            <br></br>
            <br></br>
            Next to help button there is a small circle that can be green, yellow or red.
                Green means connection is ok.
                Yellow means browser is not connected to server - either you need to change your connection or the server is down.
                Red means server has no connection to database - nothing you can do - contact admin. 
                <br></br>
                <br></br>
            version: {versionStorage}
            </p>
            
        </div>
    )
}

export default HelpModal