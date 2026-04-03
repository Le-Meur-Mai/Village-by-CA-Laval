import '../styles/Card.css'

const Card = ({name = "Startup", description = "Description", logo, color = "#CCF2B1", onClick}) => {
    return (
        <div className="card" onClick={onClick}>
            <div className='color-card' style={{ backgroundColor: `${color}` }}></div>
            <div className='card-content'>
                <div className='card_logo'>
                    {logo && <img src={logo} alt={name} />}
                </div>
                <h4 className="card-title">{ name }</h4>
                <p className="card-description">{ description.length > 100
                ? description.slice(0, 200) + "..."
                : description}</p>
            </div>
        </div>
    )
}

export default Card;