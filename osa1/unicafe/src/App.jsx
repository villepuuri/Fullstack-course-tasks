import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>
    {text}
  </button>
}

const StatisticLine = ({ text, stat }) => {
  if (text === "positive") {
    return <tr>
          <td>{text}</td>
          <td>{stat} %</td>
        </tr>
  } else {
    return <tr>
          <td>{text}</td>
          <td>{stat}</td>
        </tr>
  }
}

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  if (good + neutral + bad > 0) {
    return <div>
      <Header text={"Statistics"} />
      <table>
        <tbody>
          <StatisticLine text={"good"} stat={good} />
          <StatisticLine text={"neutral"} stat={neutral} />
          <StatisticLine text={"bad"} stat={bad} />
          <StatisticLine text={"all"} stat={good + neutral + bad} />
          <StatisticLine text={"average"} stat={(good - bad) / (good + neutral + bad)} />
          <StatisticLine text={"positive"} stat={(good) / (good + neutral + bad)} />
        </tbody>
      </table>
    </div>
  } else {
    return <div>
      <Header text={"Statistics"} />
      <p>No feedback given</p></div>
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => {
    return setGood(good + 1)
  }

  const addNeutral = () => {
    return setNeutral(neutral + 1)
  }

  const addBad = () => setBad(bad + 1)

  return (
    <div>
      <Header text={"Give feedback"} />
      <Button handleClick={addGood} text={"good"} />
      <Button handleClick={addNeutral} text={"neutral"} />
      <Button handleClick={addBad} text={"bad"} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App