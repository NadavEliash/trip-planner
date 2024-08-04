import React from 'react'

export default function Loader() {
    return (
        <div className='loader'>
            <div className='loader-bg'></div>
            <div>
                <h1 className='loader-heading'>You pack your things, we plan your trip...</h1>
                <img src="./plane.svg" alt="plane" className='plane' />
            </div>
        </div>
    )
}
