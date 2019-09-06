import React, { useState, useEffect } from 'react'


//could use this to make the times tick up more naturally - BUT would cause problems with database times
const Timer = () => {
    const [count, setCounter] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            setCounter(count+1)
        }, 1000);
    }, [count])

    return (
        <div>Current count is: {count}</div>
    )
}

export default Timer