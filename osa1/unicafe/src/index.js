import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.clickHandler}> {props.text} </button>
  )
}

const Statistic = ({text, value}) => {
  return (
    <tr><td>{text}</td><td>{value}</td></tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = () => good + neutral + bad;
  const average = () => (good + bad*(-1)) / noDivisionByZero(total());
  const noDivisionByZero = (number) => number === 0 ? 1 : number;
  const isThereAnyFeedback = () => (good + neutral + bad) > 0;
  if (isThereAnyFeedback()) {
    return (
      <div>
        <Header text={"statistiikka"} />
        <table>
          <tbody>
            <Statistic text={"hyvä"} value={good} />
            <Statistic text={"neutraali"} value={neutral} />
            <Statistic text={"huono"} value={bad} />
            <Statistic text={"yhteensä"} value={total()} />
            <Statistic text={"keskiarvo"} value={average()} />
            <Statistic text={"positiivisia"} value={(good / noDivisionByZero(total()) * 100).toString() + " %"} />
          </tbody>
        </table>
      </div>
    )
  }
  else {
    return (
      <div>
        <Header text={"statistiikka"} />
        <p>Ei yhtään palautetta</p>
      </div>
    )
  }

}



const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <Header text={"anna palautetta"} />
      <Button text={"hyvä"} clickHandler={() => setGood(good + 1)} />
      <Button text={"neutraali"} clickHandler={() => setNeutral(neutral + 1)} />
      <Button text={"huono"} clickHandler={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)