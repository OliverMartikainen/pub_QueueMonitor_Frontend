import React from 'react'
import './AgentHeader.css'

const AgentCount = ({idStatus, idNumber, status, count}) => {
 
    return (
        <div className='agent-count'> 
            <div className='status' id={idStatus}>
                {status}
            </div>
            <div className='number' id={idNumber}>
                {count}
            </div>
        </div>
    )
}


const AgentHeader = ({ statusCount }) => {

    return (
        <div className='agent-header'>
            <AgentCount idStatus='center' idNumber='left' status='FREE: ' count={statusCount.free} />
            <AgentCount idStatus='right' idNumber='center'  status='RESERVED: ' count={statusCount.reserved} />
            <AgentCount idStatus='right' idNumber='center'  status='BUSY: ' count={statusCount.busy} />
            <AgentCount idStatus='right' idNumber='center'  status='TOTAL: ' count={statusCount.total} />
        </div>
    )
}

export default AgentHeader