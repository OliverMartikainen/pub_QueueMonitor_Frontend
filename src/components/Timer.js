import React, { useState, useEffect } from 'react'


//could use this to make the times tick up more naturally - BUT would cause problems with database times
const Timer = ({state,setState}) => {
    const [count, setCounter] = useState(0)
    useEffect(() => {
        setTimeout(() => {
            setCounter(count+1)
            console.log(window.innerHeight, window.screen.height)
            if (window.innerHeight === window.screen.height) {
                if(!state) {
                    setState()
                }
              } else {
                if(state) {
                    setState()
                }
              }
            
        }, 1000);
    }, [count, state, setState])
    const a = state ? 'true' : 'false'
    return (
        <div>Current count is: {count} {a}</div>
    )
}

export default Timer