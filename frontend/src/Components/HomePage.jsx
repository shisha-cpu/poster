import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import axios from 'axios';
import EventCard from './EventCard'; 
import { useSelector } from 'react-redux';
import './EventCard.css';

export default function HomePage() {
    const [data , setData ] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:4444/events')
        .then(res => setData(res.data))
        .catch(e => console.log(e))
    }, []);

    const filteredData = data.filter(event => {
        return event.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <h1 className='home-title'>Афиша</h1>
            <input
                type="text"
                placeholder="Поиск по заголовку"
                value={searchTerm}
                onChange={handleSearch}
                className='seacrh-input'
            />
            <div className="event-list">
                {filteredData.map((event , id) => (
                    <EventCard key={id} event={event} />
                ))}
            </div>
        </>
    );
}

