import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../store/slices/user'; // Импортируем setUser из среза пользователя
import { loggin } from '../../../store/slices/isLoggin';
import './Login.css'
const Login = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user); // Получаем информацию о пользователе из состояния Redux

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (redirect) {
            dispatch(loggin());
        }
    }, [redirect, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4444/login', formData)
            if (res.data) {
               setRedirect(true);
               console.log("User information:", res.data.user);
               dispatch(setUser(res.data.user)); // Сохраняем информацию о пользователе в Redux
            }
        } catch (error) {
            alert('Вход не удался');
            console.error(error);
        }
    };

    if (redirect) {
        return <Navigate to='/' />; 
    }

    return (
        <div className="login-container"> {/* Обертка для формы входа */}
        <form onSubmit={handleSubmit} className="login-form"> {/* Форма входа */}
            <h2>Вход</h2>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Вход</button>
        </form>
    </div>
    );
};

export default Login;
