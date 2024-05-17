import React from 'react';
import './EventCard.css';
import Buy from './Buy/Buy';
import { useSelector } from 'react-redux';

export default function EventCard({ event }) {
    const isLoginIn = useSelector(state => state.isLoggin);
    return (
        <div className="event-container">
            <div className="event-card">
                <h2>{event.title}</h2>
                <img src={event.image} alt={event.title} className='img' />
                <p>{event.description}</p>
                <p>дата: {new Date(event.date).toLocaleDateString()}</p>
                <p>время: {event.time}</p>
                <p>цена: {event.price} рублей </p>
                {isLoginIn.isLoggin ? <Buy eventId={event._id} /> : ''}
            </div>
        </div>
    );
};
