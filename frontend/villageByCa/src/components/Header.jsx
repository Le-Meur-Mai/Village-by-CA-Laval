import '../styles/Header.css'

const Header = () => {
    return (
        <header>
            <img src="logo" alt="logo du Village By CA" />
            <div className='navBox'>
                <nav className='navbar'>
                    <a href="/startups">Startups</a>
                    <a href="/partenaires">Partenaires</a>
                    <a href="/agenda">Agenda</a>
                    <a href="/locations">Locaux</a>
                </nav>
            </div>
            <a href="/contact"><button className='contact'>Contact</button></a>
        </header>
    )
}

export default Header;