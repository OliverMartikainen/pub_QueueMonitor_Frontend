import React, { useState } from 'react'
import './App.css'

const App = () => {
  var [count, setCount] = useState(0)


  return (
    <div>
      <div className="Queue">
        <p>aa</p>
      </div>
      <div className="App">
        <header className="App-header">
          <p>hello {count}</p>
        </header>
      </div>
    </div>
  );
}

export default App;
