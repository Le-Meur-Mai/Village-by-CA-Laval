import '../styles/Card.css'

const Card = ({title = "Titre", description = "Description"}) => {
    return (
        <div className="card">
            <div className='color-card'></div>
            <div className='card-content'>
                <div className='card_logo'></div>
                <h4 className="card-title">{ title }</h4>
                <p className="card-description">{ description }</p>
            </div>
        </div>
    )
}

export default Card;