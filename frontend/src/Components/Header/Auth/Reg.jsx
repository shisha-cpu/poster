import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Importing useDispatch
import { loggin } from '../../../store/slices/isLoggin'; // Assuming you have defined loggin action
import './Reg.css'; // Importing CSS file for styles

const Reg = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        phone: '',
    });
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch(); // Dispatch function
    const navigate = useNavigate(); // Using useNavigate hook

    useEffect(() => {
        if (redirect) {
            dispatch(loggin());
            navigate('/'); // Navigating to '/' if redirect is true
        }
    }, [redirect, dispatch, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4444/register', formData);
            alert('Registration successful');
            setRedirect(true); // Setting redirect to true after successful registration
        } catch (error) {
            alert('Registration failed');
            console.error(error);
        }
    };

    return (
        <div className="registration-container">
            <form onSubmit={handleSubmit} className="registration-form"> {/* Form styling */}
                <h2>Registration</h2>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Reg;
