import React from 'react'
import { useDispatch } from "react-redux"
import { useSelector } from 'react-redux'
import { useState } from "react"
import { CONFIRM, CANCEL } from './actions'

function Notes() {
    const [text, setText] = useState('')
    const dispatch = useDispatch()
    const onTextChange = event => {
        setText(event.target.value)
    }

    const Confirm = () => {
        dispatch({
            type: CONFIRM,
            text
        })
    }

    const Cancel = () => {
        dispatch({
            type: CANCEL,
            text
        })
    }

    return (
        <fieldset>
            <button onClick={Confirm}>Confirm</button>
            <button onClick={Cancel}>Cancel</button>
            <textarea value={text} onChange={onTextChange} type="text"></textarea>
        </fieldset>
    )
}

export default Notes