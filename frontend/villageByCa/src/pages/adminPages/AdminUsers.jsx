import '../../styles/page.css'

import '../../styles/AdminQuotes.css'

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import PresentationPage from '../../components/PresentationPage.jsx';
import { useEffect, useState } from 'react';
import { useNavigate} from "react-router-dom";
import UserInfoProfil from '../../components/UserInfoProfil.jsx';
import NewUserButton from '../../components/buttons/NewUserButton.jsx';

const AdminUsers = () => {
    const navigate = useNavigate();

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/users', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Admin non connecté.');
                }
                
                const usersData = await response.json();
    
                setAllUsers(usersData);
    
            } catch (error) {
                console.error(error);
                navigate('/login');
            }
        }

        fetchAllUsers();

    }, [])

    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage title='Gestion des Utilisateurs' text=''/>
                <div className='new-quote-admin-section'>
                    <NewUserButton onUpdate={setAllUsers} />
                </div>
                <div className='quote-align'>
                    {allUsers
                        .filter(user => !user.isAdmin)
                        .map(user => (
                            <UserInfoProfil key={user.id} user={user} onUpdate={setAllUsers}/>
                        ))
                    }
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default AdminUsers;