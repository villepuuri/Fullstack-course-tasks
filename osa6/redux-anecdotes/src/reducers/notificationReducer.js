import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setCreation(state, action) {
            if (action.payload !== '') {
                return `you created '${action.payload}'`
            }
            else {
                return ''
            }
        },
        setVoted(state, action) {
            if (action.payload !== '') {
                return `you voted '${action.payload}'`
            }
            else {
                return ''
            }
        }
    }
})

export const addCreateNotification = (content) => {
    return {
        type: 'notification/setCreation',
        payload: content,
    }
}
export const addVoteNotification = (content) => {
    return {
        type: 'notification/setVoted',
        payload: content,
    }
}

export const { setCreation, setVoted } = notificationSlice.actions
export default notificationSlice.reducer