import React from 'react'

export default function NotFound({setIsError}) {
    return (
        <div className='not-found' onClick={() => setIsError(false)}>
            <div className='text'>
                <h1>Oops...</h1>
                <h2>something went wrong. please try again</h2>
            </div>
        </div>
    )
}
