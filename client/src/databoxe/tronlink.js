const Tronlink = (props) => {
    console.log('Tronlink : ', props)
    console.log('Tronlink : ', props.data.json)

    const subTotal = (props.data.json.assets.reduce((acc, asset) => {
        return acc + asset.price * asset.amount
    }, 0)).toFixed(2)

    return (
        <div className="boxes">
            <div className="header">
                <button>Fermer</button>
                <h2>{props.data.name}</h2>

                <h3>Total : {subTotal}$</h3>
            </div>
            <div>
                <h4> {props.data.json.address} </h4>
                <h4> SubTotal : {subTotal}$ </h4>
                <ul className="content">
                    <li className='alignText'>
                        <h3>Symbol : </h3>
                        <h4>Amount : </h4>
                        <h4>Price : </h4>
                        <h4>Value : </h4>
                    </li>
                    {props.data.json.assets.map((asset, index) => {
                        return (
                            <li key={index}>
                                <h3>{asset.symbol}</h3>
                                <h4>{asset.amount}</h4>
                                <h4>{asset.price}$</h4>
                                <h4>{asset.value}$</h4>
                            </li>
                        )
                    })}
                </ul>
                <ul>
                    <li>
                        <h3>availableTRX : {props.data.json.availableTRX}</h3>
                        <h3>frozenTRX : {props.data.json.frozenTRX}</h3>
                        <h3>balanceEnergy : {props.data.json.balanceEnergy}</h3>
                        <h3>balanceBandwidthInAddition : {props.data.json.balanceBandwidthInAddition}</h3>
                        <h3>tronpower : {props.data.json.tronpower}</h3>
                        <h3>reward : {props.data.json.reward}</h3>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Tronlink