import React from 'react'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from 'react-redux'
import { ADD_PAGE } from './actions'

function PageItem({ item, index }) {
    return (
        item.text
    )
}

function PageListing() {
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const titles = useSelector((state) => state.titles)

    const addClick = () => {
        dispatch({
            type: ADD_PAGE,
            text
        })
    }
    return (
        <div>
            {
                titles.map((item, index) => (
                    <li key={index}>
                        <PageItem key={index} item={item} index={index} />
                    </li>
                ))
            }
        </div>
    )
}

export default PageListing