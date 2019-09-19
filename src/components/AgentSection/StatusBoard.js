import React from 'react'
import './StatusBoard.css'

const StatusCount = ({ status, count}) => {


    return (
        <div className='StatusCount'> 
            <div>
                {status}
            </div>
            <div>
                {count}
            </div>
        </div>
    )
}


const StatusBoard = ({ statusCount }) => {


    return (
        <div className='StatusBoard'>
            <StatusCount status='FREE: ' count={statusCount.free} />
            <StatusCount status='RESERVED: ' count={statusCount.reserved} />
            <StatusCount status='BUSY: ' count={statusCount.busy} />
            <StatusCount status='TOTAL: ' count={statusCount.total} />
        </div>
    )
}

export default StatusBoard