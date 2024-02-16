import { createAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import { addCreateNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {

    const dispatch = useDispatch()

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        console.log('Adding a new anecdote: ', content)
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))

        dispatch(addCreateNotification(content))
        setTimeout(() => {
            dispatch(addCreateNotification(''))
          }, 5000)
    }

    return (
        <div>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name='anecdote' />
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm