import '../../styles/page.css'

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PresentationPage from '../../components/PresentationPage';
import { useEffect, useState } from 'react';
import Tag from '../../components/Tag';

const AdminTags = () => {

    const [allTypes, setAllTypes] = useState([]);

    useEffect(() => {
        const getAllTypes = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/types',  {
                    method: 'GET',
                    credentials: 'include'
                })
    
                const data = await response.json();
    
                setAllTypes(data)
            } catch (error) {
                console.error(error);
            }
        }
        getAllTypes()
    }, [])

    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage title='Gestion des Types' text='' />
                <div>
                    {allTypes.map(type =>
                        <Tag key={ type.id } name={ type.name } color={ type.color } />
                    )}
                </div>
    
            </main>
            <Footer />
        </div>
    )
}

export default AdminTags;