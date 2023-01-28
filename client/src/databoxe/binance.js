const Binance = (props) => {
    console.log('Binance : ', props)
    console.log('Binance : ', props.data.json)

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

export default Binance