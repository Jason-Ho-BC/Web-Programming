import { createStore } from 'redux'
import { ADD_PAGE, CONFIRM, CANCEL } from './actions'

const defaultState = {
    todos: [{ text: 'make this app do something' }]
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
                todos: [...state.todos, { text: action.text, done: false }]
            }
    }
    switch (action.type) {
        case CONFIRM:
            return {
                ...state,
                todos: [...state.todos, { text: action.text, done: false }]
            }
    }
    switch (action.type) {
        case CANCEL:
            return {
                ...state
            }
    }
    return state
}

const store = createStore(rootReducer)

export default store