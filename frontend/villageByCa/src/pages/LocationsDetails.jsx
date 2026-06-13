import Button from "../components/buttons/button.jsx";
import PicturesLocation from "../components/PicturesLocation.jsx";
import LocationInfo from "../components/LocationInfo.jsx";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PresentationPage from "../components/PresentationPage.jsx";
import "../styles/page.css";

import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
  
const LocationDetails = () => {
    const { id } = useParams();
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

  
    useEffect(() => {
      const fetchLocation = async () => {
        try {
            const result = await fetch(`http://localhost:3000/locations/${id}`);
            if (!result.ok) {
              // Erreur HTTP (404, 500…)
              throw new Error("Location introuvable");
            }
            const json = await result.json();
            setLocation(json);
        } catch (err) {
            setError(err.message);
        }}
      fetchLocation();
    }, [id]);

    if (!location && !error) {
        return (<h2>Chargement ...</h2>);
    } else if (error) {
        return (
        <div className="page">
            <Header />
            <main>
                <div className="">
                    <h2 className="paragraph-center">{error}</h2>
                </div>
            </main>
            <Footer />
        </div>
        );
    } else {
        return (
            <div className="page">
                <Header/>
                <main>
                    <PresentationPage
                    title= {location.title}
                    text=""/>
                    <div className="button-on-the-left">
                        <Button
                        text="Retour →"
                        path="http://localhost:5173/locations"/>
                    </div>
                    <br></br>
                    <div className="location-details-page">
                        <PicturesLocation pictures={location.pictures} />
                        <LocationInfo
                        price={location.price}
                        size={location.size}
                        description={location.description}
                        />
                    </div>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default LocationDetails;