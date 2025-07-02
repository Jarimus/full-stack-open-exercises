import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Statistics = ( {good, neutral, bad} ) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </>
      
    )
  }
  return (
    <>
      <h2>statistics</h2>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {good + bad + neutral}</div>
      <div>average {(good - bad) / (good + neutral + bad)}</div>
      <div>positive { good / (good + bad + neutral) * 100} %</div>
    </>

  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    const newGoodClicks = good + 1;
    setGood( newGoodClicks );
  }

  const handleNeutralClick = () => {
    const newNeutralClicks = neutral + 1;
    setNeutral( newNeutralClicks );
  }

  const handleBadClick = () => {
    const newBadClicks = bad + 1;
    setBad( newBadClicks );
  }

  return (
    <div>
      <h2>give feedback</h2>
      <p>
        <Button onClick={handleGoodClick} text="good" />
        <Button onClick={handleNeutralClick} text="neutral" />
        <Button onClick={handleBadClick} text="bad" />
      </p>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App