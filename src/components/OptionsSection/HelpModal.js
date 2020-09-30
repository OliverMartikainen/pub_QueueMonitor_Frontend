import React from 'react'
import './HelpModal.css'

//ADD HELP - "f11 for fullscree, optimal for 1920x1080 100% zoom - choose x then y
// - if says b then b etc."


const HelpModal = ({ showHelp }) => {
    const modalId = showHelp ? 'show' : 'hide'
    const versionStorage = window.sessionStorage.getItem('serverVersion')
    return (
        <div className='help-modal' id={modalId} >
            <p>
                <b>VERSION: {versionStorage}</b>
            </p>
            <p>
                <b> "CHOOSE FILTERS"</b> button:
                    <br />
                - Use it to select different filters for the CALL and EMAIL queues, and the Agents shown.
                    <br />
                - Selected PROFILE's determine the QUEUE filter.
                <br />
                - Selected TEAM's determine the AGENT filter.
                    <br />
                Filter selection clarity will be improved in future.
                </p>

            <p>
                <b>"REMOVE FILTERS"</b> button:
                    <br />
                - Use it to remove all selected filters.
                </p>
            <p>
                <b>"SERVICE ALARMS"</b> button:
                <br />
                - Shows all active service channels. Your "CHOOSE FILTERS" --> PROFILE's determine these.
                <br />
                - All services shown here will be shown in QUEUE if an email or call comes from it.
                <br /><br />
                You can choose the alarm level of the CALLS of each service (emails not affected).
                <br />
                - NORMAL alarm is the default level - it is shown only in CALL section.
                <br />
                - MEDIUM alarm will show the call as a separate larger RED box.
                <br />
                - VIP alarm will trigger a screen wide flasing display with 20 second countdown and sound alarm.
                <br />
                <i>*NOTE for sound to work you need to allow autoplay in browser/click it once/use Chrome for less issues</i>
            </p>
            <p>
                <b> "CENSOR"</b> button:
                    <br />
                - Hides shows only 1st letter of Service Names and hides lastnames of Agents.
                </p>
            <p>
                <b>"ERROR MESSAGE/LIGHT"</b>:
                <br />
                - The status light is green when connection is good and everything is working.
                <br />
                - The status light is yellow when the browser cannot connect to the server. Either you need to change your connection or the server is down.
                <br />
                - The status light is red when the server cannot connect to the database. Contact admin.
                </p>
            <p>
                <b>"SHOW/HIDE QUEUE or AGENTS"</b> dashboards:
                <br />
                - Hover over top center.
                <br />
                - Click the buttons
            </p>

        </div>
    )
}

export default HelpModal