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

export default Bybit