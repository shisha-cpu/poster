import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Dashboard.css'; 
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const user = useSelector(state => state.user);
    const [userTickets, setUserTickets] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4444/tickets/${user.user._id}`)
            .then(res => {
                setUserTickets(res.data);
            })
            .catch(err => {
                console.error('Ошибка при загрузке билетов:', err);
            });
    }, []);

    const downloadTicket = async (ticketId) => {
        try {
            const response = await axios.get(`http://localhost:4444/tickets/download/${ticketId}`, {
                responseType: 'blob' 
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ticket.pdf'); 
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Ошибка при скачивании билета:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="user-info">
                <h1>Личный кабинет пользователя: {user.user.name}</h1>
                <hr />
                <div className="user-details">
                    <p className="user-detail">Телефон: {user.user.phone}</p>
                    <p className="user-detail">Фамилия: {user.user.surname}</p>
                    <p className="user-detail">Email: {user.user.email}</p>
                    {user.user.email === 'admin@admin.ru' ? <Link to='/addEvent'>добавить мероприятие</Link> : ''}
                </div>
            </div>

            <div className="tickets-container">
                <h2>Билеты пользователя:</h2>
                {userTickets.map(ticket => (
                    <div key={ticket._id} className="ticket">
                        {ticket.event && (
                            <React.Fragment>
                                <p className="event-title">Мероприятие: {ticket.event.title}</p>
                                <p className="event-date">Дата: {new Date(ticket.event.date).toLocaleDateString()}</p>
                                <p className="event-description">Описание: {ticket.event.description}</p>
                                <button onClick={() => downloadTicket(ticket._id)}>Скачать билет</button> {/* Добавляем кнопку для скачивания билета */}
                                <hr />
                            </React.Fragment>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
