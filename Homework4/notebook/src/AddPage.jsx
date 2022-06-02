import React from 'react'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from 'react-redux'
import { ADD_PAGE } from './actions'

function AddPage() {
    const [text, setText] = useState('Untitled')
    const dispatch = useDispatch()

    const addClick = () => {
        dispatch({
            type: ADD_PAGE,
            text
        })
    }

    return (
        <li>
            <button onClick={addClick} > Add Page </button>
        </li>
    )
}

export default AddPage