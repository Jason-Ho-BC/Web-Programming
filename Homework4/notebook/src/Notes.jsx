import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { useSelector } from 'react-redux'
import { useState } from "react"
import { CONFIRM, CANCEL, EDIT, DELETE } from './actions'

function PageItem({ item, index }) {
    return (
        item.text
    )
}

function BodyItem({ item, index }) {
    return (
        item.text
    )
}

function FindIndex() {
    const titles = useSelector((state) => state.titles)
    var index = 0
    titles.FindIndex()

    return "Hi"
}

//Use this to load and update localstorage
useEffect(() => {

})

function Notes() {
    const [text, setText] = useState('')
    const [title, setTitle] = useState('')
    const dispatch = useDispatch()
    const titles = useSelector((state) => state.titles)
    const body = useSelector((state) => state.body)

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

    const Edit = () => {
        dispatch({
            type: EDIT,
            text
        })
    }

    const Delete = () => {
        dispatch({
            type: DELETE,
            text
        })
    }

    return (
        <div>
            <div>
                <header>
                    {
                        titles.map((item, index) => (
                            <li key={index}>
                                <PageItem key={FindIndex} item={item} index={index} />
                            </li>
                        ))
                    }
                </header>
                <button onClick={Edit}>Edit</button>
                <button onClick={Delete}>Delete</button>
            </div>
            <fieldset>
                <button onClick={Confirm}>Confirm</button>
                <button onClick={Cancel}>Cancel</button>
                <textarea value={text} onChange={onTextChange} type="text">
                    {
                        body.map((item, index) => (
                            <li key={index}>
                                <BodyItem key={index} item={item} index={index} />
                            </li>
                        ))
                    }
                </textarea>
            </fieldset>
        </div>
    )
}

export default Notes