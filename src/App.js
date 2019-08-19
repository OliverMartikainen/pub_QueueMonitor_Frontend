import React, { useState } from 'react'
import './App.css'

/*
  Have an options menu with interactivity, monitor screen would have only 1 button and auto re-renders?
  So in theory low number of useState hooks?
*/

const PlanButton = ({ setPlan }) => {
  console.log(setPlan, { setPlan })
  return (
    <button onClick={setPlan}>Display/hide plan</button>
  )
}

const Plan = () => {
  return <img src="preliminaryLayout.jpg" alt="aa" width="900" heigth="900" />
}

const TopLeft = () => {
  return (
    <div>
      <p>List of phone calls NAME # TIME</p>
    </div>
  )
}

const TopRight = ({ plan }) => {
  if (plan) {
    return (
      <Plan />
    )
  }
  else {
    return (
      <div>
        <p>Grid of Agents?</p>
      </div>
    )
  }
}

const App = () => {
  const [plan, setPlan] = useState(false)

  if (plan) {
    console.log(plan)
  }
  else {
    console.log(plan)
  }

  return (
    <div>
      <div className="left leftTop">
        <TopLeft />
      </div>

      <div className="left leftBottom">
        <p>This isnt really needed, can make a small area with options?</p>
      </div>

      <div className="right rightTop">
        <TopRight plan={plan} />
      </div>

      <div className="right rightBottom">
        <p>General stats, maybe 20% of heigth</p>
        <PlanButton setPlan={() => setPlan(!plan)} />
      </div>

    </div>
  );
}

export default App;
