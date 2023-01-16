// client/src/App.js

import React from 'react'
import logo from './logo.svg'
import './App.css'

const App = () => {
    const [data, setData] = React.useState(null)

    const handleClick = async () => {
        const response = await fetch('/api')
        const body = await response.json()
        setData(body.message)
        console.log(body.message)
    }

    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                <button type='button' onClick={handleClick}> Click me </button>
                <p>{!data ? 'Loading...' : data}</p>
            </header>
        </div>
    )
}

export default App
