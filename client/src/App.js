// client/src/App.js

import React from 'react'
import './App.css'
import './style.css'

const Binance = (props) => {
    return (
        <div className="boxes">
            <div className="header">
                <button>Fermer</button>
                <h2>{props.data.name}</h2>
                <h3>Total : {props.data.json.total}$</h3>
            </div>
            <div className="content">
                <ul>
                    {props.data.json.assets.map((asset, index) => {
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

const Kucoin = (props) => {
    console.log('Kucoin : ', props)
    console.log('Kucoin : ', props.data.json)

    return (
        <div className="boxes">
            <div className="header">
                <button>Fermer</button>
                <h2>{props.data.name}</h2>
                <h3>Total : {props.data.json.total}$</h3>
            </div>
            <div className="content">
                <ul className="content">
                    <li className='alignText'>
                        <h3>Asset : </h3>
                        <h4>Type : </h4>
                        <h4>Amount : </h4>
                        <h4>Price : </h4>
                        <h4>Total : </h4>
                    </li>
                    {props.data.json.assets.map((asset, index) => {
                        return (
                            <li key={index}>
                                <h3>{asset.asset}</h3>
                                <h4>{asset.type}</h4>
                                <h4>{asset.amount}</h4>
                                <h4>{asset.price}</h4>
                                <h4>{asset.total}</h4>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

const Bybit = (props) => {
    console.log('Bybit : ', props)
    console.log('Bybit : ', props.data.json)

    return (
        <div className="boxes">
            <div className="header">
                <button>Fermer</button>
                <h2>{props.data.name}</h2>
                <h3>Total : {props.data.json.total}$</h3>
            </div>
            <div className="content">
                <ul className="content">
                    <li className='alignText'>
                        <h3>Coin : </h3>
                        <h4>Lock : </h4>
                        <h4>Free : </h4>
                        <h4>Total : </h4>
                    </li>
                    {props.data.json.assets.map((asset, index) => {
                        return (
                            <li key={index}>
                                <h3>{asset.coin}</h3>
                                <h4>{asset.lock}</h4>
                                <h4>{asset.free}</h4>
                                <h4>{asset.total}</h4>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}


class Exchange extends React.Component {
    constructor(props) {
        super(props);
        console.log('CONSTRUCTOR')
        console.log('props : ', props)
        console.log('this.props.data.name : ', this.props.data.name)
        console.log('this.props.data.name.localeCompare(\'binance\') : ', this.props.data.name.localeCompare('binance'))
    }

    render() {
        if (this.props.data.name.localeCompare('binance') === 0) {
            return <Binance data={this.props.data} />
        } else if (this.props.data.name.localeCompare('kucoin') === 0) {
            return <Kucoin data={this.props.data} />
        } else if (this.props.data.name.localeCompare('bybit') === 0) {
            return <Bybit data={this.props.data} />
        } else {
            <div className="boxes">
                NON TRAITE !!!
            </div>
        }
    }
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
        fetch("/datahubcrypto")
            .then(response => response.json())
            .then(donnee => {
                console.log('=== DONNEE API datahubcrypto : ', donnee)
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
        <div className='app'>
            <Main />
        </div>
    )
}


export default App
