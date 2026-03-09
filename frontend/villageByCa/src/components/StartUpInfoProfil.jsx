import '../styles/StartUpInfoProfil.css';

const StartUpInfoProfil = ( {startup} ) => {
    if (!startup) {
        return (
            <div className="startup-card">
                <h2>Ma Start-up</h2>
                <p>Aucune start-up enregistrée.</p>
            </div>
        )
    }
    
    return (
        <div className="startup-card">
    
            <h2><strong>Ma Start-up</strong></h2>
    
            <img src={startup.logo} alt="logo" />
    
            <div className='startup-card-info'>
                <p><strong>Nom :</strong> {startup.name}</p>
        
                <p><strong>Site :</strong> {startup.website}</p>
        
                <p><strong>Type :</strong></p>
                <div className="tags">
                    {startup.types.map((type,i) => (
                        <span key={type.id}>{type.name}</span>
                    ))}
                </div>
        
                <p>{startup.description}</p>

            </div>
            
            <button>Modifier</button>
    
        </div>
    )
}

export default StartUpInfoProfil;