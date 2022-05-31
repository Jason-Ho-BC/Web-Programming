import React from 'react'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { ADD_PAGE } from './actions'

export default function TodoForm() {
    const [text, setText] = useState('Untitled')
    const dispatch = useDispatch()
    const onTextChange = event => {
        setText(event.target.value)
    }
    const addClick = () => {
        dispatch({
            type: ADD_PAGE,
            text
        })
    }
    return (
        <ul>
            <li>
                <button onClick={addClick}>Add Page</button>
            </li>
            <li>
                Page 1
            </li>
            <li>
                Page 2
            </li>
            <li>
                Page 3
            </li>
        </ul>
    )
}