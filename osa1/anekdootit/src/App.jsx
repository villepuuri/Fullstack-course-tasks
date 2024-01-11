import { useState } from 'react'

const Button = ({handlePress, text}) => <button onClick={handlePress}>{text}</button>

const Header = ({text}) => <h1>{text}</h1>

const PlainText = ({text}) => <p>{text}</p>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(
    new Uint8Array(anecdotes.length)
    )

  const buttonClickNext = () => {
    console.log("Button clicked")

    // Get random index
    const index = Math.round(Math.random() * (anecdotes.length - 1) )
    console.log(index)

    // Set new anecdote
    setSelected(index)
  }

  const buttonClickVote = () => {
    console.log("Pressed Vote-button")

    // Create an updated votes-object
    const newVotes = [...votes]
    newVotes[selected] += 1

    // Set new votes
    setVotes(newVotes)
  }

  const getMaxIndex = () => {
    console.log("in getMaxIndex")

    let maxIndex = 0
    for (let i = 1; i < votes.length; i++){
      if (votes[i] > votes[maxIndex]) {
        console.log("New maxIndex: ", i)
        maxIndex = i
      }
    }
    return maxIndex
  }
  

  return (
    <div>
      <Header text={"Anecdote of the day"} />
      <PlainText text={anecdotes[selected]} />
      <PlainText text={"has " + String(votes[selected]) + " votes"} />
      <Button handlePress={buttonClickVote} text={"vote"}/>
      <Button handlePress={buttonClickNext} text={"next anecdote"} />
      <Header text={"Anecdote with most votes"} />
      <PlainText text={anecdotes[getMaxIndex()]} />
      
    </div>
  )
}

export default App