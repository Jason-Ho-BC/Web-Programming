import { createStore } from 'redux'
import { ADD_PAGE, CONFIRM, CANCEL, DELETE, EDIT } from './actions'

const defaultState = {
    todos: [{ text: 'make this app do something' }],
    titles: ['fuck'],
    body: ['stuff'],
}

function rootReducer(state, action) {
    console.log('reducer', state, action)
    if (!state) {
        return defaultState
    }
    switch (action.type) {
        case ADD_PAGE:
            return {
                ...state,
                titles: [...state.titles, { text: action.text }]
            }
    }
    switch (action.type) {
        case CONFIRM:
            return {
                ...state,
                body: [...state.body, { text: action.text }]
            }
    }
    switch (action.type) {
        case CANCEL:
            return {
                ...state
            }
    }
    switch (action.type) {
        case DELETE:
            return {
                ...state
            }
    }
    switch (action.type) {
        case EDIT:
            return {
                ...state
            }
    }
    return state
}

const store = createStore(rootReducer)

export default store