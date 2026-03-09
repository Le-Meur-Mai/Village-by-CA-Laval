import '../styles/UserInfoProfil.css';

const UserInfoProfil = ( {user} ) => {
    if (!user) {
        return (
            <div className="user-card">
                <h2>Mon profil</h2>
                <p>Utilisateur non trouvé</p>
            </div>
        )
    }
    
    return (
        <div className="user-card">
    
            <h2><strong>Mon Profil</strong></h2>
    
            <div className='user-card-info'>
                <p><strong>Nom :</strong> {user.name}</p>
        
                <p><strong>Email :</strong> {user.email}</p>
            </div>
    
        </div>
    )
}

export default UserInfoProfil;