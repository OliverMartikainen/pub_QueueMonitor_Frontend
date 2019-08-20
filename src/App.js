import React, { useState } from 'react'
import RightTop from './sections/RightTop'
import TestLists from './tests/TestLists'
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

const TopLeft = ({ plan }) => {
  if (plan) {
    return <Plan />
  }
  return (
    <div>
      <p>List of phone calls NAME # TIME</p>
    </div>
  )
}

const BottomRight = ({ setPlan }) => {

  return (
    <div>
      <p>General stats, maybe 20% of heigth</p>
      <PlanButton setPlan={setPlan} />
    </div>
  )
}

const App = () => {
  const [plan, setPlan] = useState(false)

  const AgentList = TestLists.AgentsList
  const CallList = TestLists.CallList

  if (plan) {
    console.log(plan)
  }
  else {
    console.log(plan)
  }

  return (
    <div>
      <div className="left leftTop">
        <TopLeft plan={plan} />
      </div>

      <div className="left leftBottom">
        <p>This isnt really needed, can make a small area with options?</p>
      </div>

      <RightTop agents={AgentList} />

      <div className="right rightBottom">
        <BottomRight setPlan={() => setPlan(!plan)} />
      </div>

    </div>
  );
}

export default App;
