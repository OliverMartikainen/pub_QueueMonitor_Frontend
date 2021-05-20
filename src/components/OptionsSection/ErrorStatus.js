import './ErrorStatus.css'

const ErrorStatus = ({ error }) => {

    const errorId = (error.status === 200) ? 'green' : (error.status === 503) ? 'yellow' : 'red' //green - all ok, yellow - frontend-backend problem, red- backend-database problem 
    let errorMessage = ''
    let errorExplain = 'Connection normal'
    if (error.status !== 200) {
        errorMessage = 'CONNECTION PROBLEMS'
        if(error.status === 503) {
            errorExplain = 'Server connection problems!'
        }
        if(error.status === 502) {
            errorExplain = 'Database connection problems!'
        }
    }
  
    return (
        <div className='error-board'>
            <div className='error-status'>
                <button id={errorId}></button>
                <div className='error-explain' id={`message${errorId}`}>
                    Connection status: {error.status}
                    <br></br>
                    {errorExplain}
                </div>
            </div>
            <div className='error-message' id={`message${errorId}`}>
                {errorMessage}
            </div>
        </div>

    )
}

export default ErrorStatus