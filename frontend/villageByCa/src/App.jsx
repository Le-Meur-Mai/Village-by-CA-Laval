import './App.css'

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HeroSection from './components/HeroSection.jsx';

const App = () => {
  return (
    <div className='app'>
      <Header />
      <HeroSection />
      <Footer />
    </div>
  )
}

export default App;