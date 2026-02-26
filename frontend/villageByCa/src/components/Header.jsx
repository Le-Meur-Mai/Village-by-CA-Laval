import '../styles/Header.css'

const Header = () => {
    return (
        <header className='header'>
            <div>
                <img src="logo" alt="logo du Village By CA" />
            </div>
            <div className='navBox'>
                <nav className='navbar'>
                    <a href="/startups">Startups</a>
                    <a href="/partenaires">Partenaires</a>
                    <a href="/agenda">Agenda</a>
                    <a href="/locations">Locaux</a>
                </nav>
            </div>
            <div className='contact'>
                <a href="/contact"><b>Contact</b></a>
            </div>
        </header>
    )
}

export default Header;