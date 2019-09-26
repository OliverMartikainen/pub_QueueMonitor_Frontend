import React from 'react'
import './ErrorStatus.css'

const ErrorStatus = ({error}) => {

    const errorId = (error.status === 200) ? 'green' : (error.status === 503) ? 'yellow' : 'red' //green - all ok, yellow - frontend-backend problem, red- backend-database problem 
    return (
        <div className='error-status'>
            <button id={errorId}></button>
        </div>
    )
}

export default ErrorStatus