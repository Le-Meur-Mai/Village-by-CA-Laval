import '../styles/PresentationPage.css'

const PresentationPage = ({title = 'Title', text = 'text'}) => {
    return (
        <div className="presentation-page">
            <h2 className="titre">{ title }</h2>
            <p className="text">{ text }</p>
            <div className='horizontal-line'></div>
        </div>
    )
}

export default PresentationPage;