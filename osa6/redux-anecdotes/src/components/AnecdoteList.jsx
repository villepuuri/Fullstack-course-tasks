import { voteAnecdote } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'
import { addVoteNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {

    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)

    const vote = (id) => {
        dispatch(voteAnecdote(id))
        const content = anecdotes.find(a => a.id === id).content
        dispatch(addVoteNotification(content))
        setTimeout(() => {
            dispatch(addVoteNotification(''))
          }, 5000)
    }

    const displayedAnecdotes = useSelector(state => {
        let returnList = []
        if (state.filter === '') {
            returnList = state.anecdotes
        }
        else {
            returnList = anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
        }
        const arrayToSort = [...returnList]
        return arrayToSort.sort((a, b) => {
            return b.votes - a.votes
        })
    })

    return <div>
        {
            displayedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )
        }
    </div>
}

export default AnecdoteList