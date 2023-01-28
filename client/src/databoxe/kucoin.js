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

export default Kucoin