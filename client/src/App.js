// client/src/App.js

import React from 'react'
import './App.css'
import './style.css'
import Tronlink from './databoxe/tronlink'
import Binance from './databoxe/binance'
import Kucoin from './databoxe/kucoin'
import Bybit from './databoxe/bybit'
import Bsc from './databoxe/bsc'
import Aptos from './databoxe/aptos'
import Ethereum from './databoxe/ethereum'
import Polygon from './databoxe/polygon'


class DataBoxe extends React.Component {
    constructor(props) {
        super(props);

        console.log('CONSTRUCTOR')
        console.log('props : ', props)
        console.log('this.props.data.name : ', this.props.data.name)

        this.array = {
            binance: <Binance data={this.props.data} />
        }
    }

    initialisation() {
        const componentMap = {
            binance: <Binance data={this.props.data} />,
            kucoin: <Kucoin data={this.props.data} />,
            bybit: <Bybit data={this.props.data} />,
            bsc: <Bsc data={this.props.data} />,
            aptos: <Aptos data={this.props.data} />,
            ethereum: <Ethereum data={this.props.data} />,
            polygon: <Polygon data={this.props.data} />,
            tronlink: <Tronlink data={this.props.data} />
        }

        const ComponentToRender = componentMap[this.props.data.name] || <div className="boxes"><p>NON TRAITE !!!</p></div>;

        return ComponentToRender
    }

    render() {

        return (
            this.initialisation()
        )
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
        if (this.state.data && this.state.data.defi) {

            console.log('this.state.data.exchanges : ', this.state.data.defi)
            console.log('this.state.data.exchanges : ', this.state.data.exchanges)

            let arrayAll = this.state.data.defi.concat(this.state.data.exchanges);
            console.log('arrayAll : ', arrayAll)

            return (
                arrayAll.map((element) =>
                    <DataBoxe data={element} />
                )
            )
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
