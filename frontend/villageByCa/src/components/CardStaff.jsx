import '../styles/CardStaff.css';
import { Link } from 'react-router-dom';


export default function CardStaff({name="name", job="", image=""}) {
  return (
    <Link to="http://localhost:5173/contact" className="card-staff-link">
        <div className="card-staff">
        <img className="card-staff-image" src={image} alt={name} />
        <h3 className="card-staff-name">{name}</h3>
        <p className="card-staff-role">{job}</p>
        </div>
    </Link>
  );
}
