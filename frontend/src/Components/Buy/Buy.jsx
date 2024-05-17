import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Modal from '../Modal';


const Buy = ({ eventId }) => {
    const user = useSelector(state => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const handleBuyTicket = () => {
        const seat = ''; 

        const userId = user.user._id
        if (!userId) {
            console.error('Пользователь не определен');
            return;
        }
        axios.post('http://localhost:4444/tickets', { eventId, userId, seat })
            .then(res => {
                setIsModalOpen(true); 
            })
            .catch(err => {
                console.error('Ошибка при покупке билета:', err);
            });
    };

    const closeModal = () => {
        setIsModalOpen(false); 
    };

    return (
        <div>
            <button onClick={handleBuyTicket}>КУПИТЬ</button>
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                Билет успешно куплен!
            </Modal>
        </div>
    );
};

export default Buy;
