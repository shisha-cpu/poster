import React, { useState } from 'react';
import axios from 'axios';
import './AddEvent.css';
import Modal from '../Modal';

const AddEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');
    const [image, setImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4444/events', {
                title,
                description,
                date,
                time,
                price: parseFloat(price),
                capacity: parseInt(capacity),
                image
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2>Добавление мероприятия</h2>
            <form className='event-form' onSubmit={handleSubmit}>
                <div>
                    <label>Занголовок :</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Описание :</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Дата :</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                    <label>Время:</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                    <label>Цена:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                    <label>Фото:</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
                <button className='btn' type="submit">Добавить </button>
            </form>
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                <p>Мероприятие успешно добавлено!</p>
            </Modal>
        </div>
    );
};

export default AddEvent;
