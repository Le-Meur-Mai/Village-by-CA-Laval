import '../../styles/page.css'

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PresentationPage from '../../components/PresentationPage';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserInfoProfil from '../../components/UserInfoProfil';

const AdminUsers = () => {

    const { auth, login } = useAuth()

    const [allUsers, setAllUsers] = useState([])

    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/users', {
                    method: 'GET',
                    credentials: 'include'
                });
                
                const usersData = await response.json();

                setAllUsers(usersData);

            } catch (error) {
                console.error(error);
            }
        }
        fetchAllUsers()
    }, [login, auth]);

    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage title='Gestion des Utilisateurs' text=''/>
                {allUsers.map(user => {
                    if(!user.isAdmin) {
                        return <UserInfoProfil key={user.id} user={user} onUpdate={setAllUsers}/>
                    }
                }
                )}
            </main>
            <Footer />
        </div>
    )
}

export default AdminUsers;