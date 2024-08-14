import React, { useEffect, useState } from 'react'

export default function Theme() {

    const [dark, setDark] = useState(false)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', `${dark ? 'dark' : 'light'}`)
    }, [dark])

    const toggleTheme = (e) => {
        document.documentElement.setAttribute('data-theme', e.target.className)
    }

    return (
        <>
            <p className='theme-title'>THEME:</p>
            <div className='theme' onClick={() => { setDark(!dark) }}>
                <div className={`toggle ${dark ? 'dark' : ''}`}>
                    <p>☀</p>
                </div>
            </div>
        </>
    )
}
