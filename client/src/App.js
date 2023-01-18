// client/src/App.js

import React from 'react'
import './App.css'
import './style.css'

const Exchange = (props) => {
    console.log('props : ', props)

    // Ce qu'on affiche avec ce component
    return (
        <div className="boxes">
            <div className="header">
                <button>Fermer</button>
                <h2>{props.data.name}</h2>
                <h3>Total : {props.data.total}$</h3>
            </div>
            <div className="content">
                <ul>
                    {props.data.assets.map((asset, index) => {
                        return (
                            <li key={index}>
                                <h3>{asset.name}</h3>
                                <h4>{asset.number}</h4>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

class Main extends React.Component {
    constructor(props) {
        console.log('CONSTRUCTOR')
        super(props);
        // Permet de gérer notre état courant et d'actualiser la fenetre si nécessaire
        this.state = {
            data: null,
            error: null,
            loading: true
        };
    }

    // Au moment de monter le component, on execute cette fonction
    componentDidMount() {
        fetch("/exchanges")
            .then(response => response.json())
            .then(donnee => {
                console.log('=== DONNEE API EXCHANGES : ', donnee)
                this.setState({ data: donnee, loading: false });
            })
            .catch(error => {
                this.setState({ error: error, loading: false });
            });
    }

    // Ce qu'on affiche avec ce component
    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        }
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        }
        if (this.state.data && this.state.data.exchanges) {
            return (
                this.state.data.exchanges.map((exchange) =>
                    <Exchange data={exchange} />
                )
            );
        } else {
            return <div>No data</div>;
        }
    }
}


const App = () => {
    return (
        <div className='App'>
            <Main />
        </div>
    )
}


export default App
