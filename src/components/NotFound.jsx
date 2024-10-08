import React from 'react'

export default function NotFound({setIsError}) {
    return (
        <div className='not-found' onClick={() => setIsError(false)}>
            <img src="./not-found.png" alt="not-found" />
            <div className='text'>
                <h1 className='oops'>Oops...</h1>
                <h2>something went wrong. please try again</h2>
            </div>
        </div>
    )
}
