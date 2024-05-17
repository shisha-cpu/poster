import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import pdf from 'html-pdf';
mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.weppimj.mongodb.net/poster?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB okey'))
    .catch((err) => console.log('db error', err));

const app = express();

app.use(express.json());
app.use(cors());

// Модели
const User = mongoose.model('User', {
    email: String,
    password: String,
    name: String,
    surname: String,
    phone: String,
});

const Event = mongoose.model('Event', {
    title: String,
    description: String,
    date: Date,
    time: String,
    price: Number,
    capacity: Number,
    image: String, // Добавляем поле для ссылки на изображение
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
});


const Ticket = mongoose.model('Ticket', {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seat: String,
    status: String,
});

// Регистрация пользователя
app.post('/register', async(req, res) => {
    const { email, password, name, surname, phone } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, name, surname, phone });
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
        res.status(201).send({ message: 'User created successfully', token, user });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Авторизация пользователя

app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
        res.send({ token, user });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


// Создание мероприятия
app.post('/events', async(req, res) => {
    const { title, description, date, time, price, capacity, image } = req.body; // Добавляем image
    const event = new Event({ title, description, date, time, price, capacity, image }); // Передаем image
    try {
        await event.save();
        res.status(201).send({ message: 'Event created successfully' });
    } catch (err) {
        res.status(400).send({ message: 'Error creating event' });
    }
});


// Получение списка мероприятий
app.get('/events', async(req, res) => {
    const events = await Event.find().populate('tickets');
    res.send(events);
});

// Покупка билета
app.post('/tickets', async(req, res) => {
    const { eventId, userId, seat } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).send({ message: 'Event not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }
    const ticket = new Ticket({ event, user, seat, status: 'approved' });
    try {
        await ticket.save();
        res.status(201).send({ message: 'Ticket created successfully' });
    } catch (err) {
        res.status(400).send({ message: 'Error creating ticket' });
    }
});
// Ваш серверный код

app.get('/tickets/download/:id', async(req, res) => {
    const ticketId = req.params.id;
    try {
        const ticket = await Ticket.findById(ticketId).populate('event').populate('user'); // Добавляем populate для пользователя
        if (!ticket) {
            return res.status(404).send({ message: 'Ticket not found' });
        }

        // Формируем HTML для билета
        // Формируем HTML для билета
        const htmlContent = `
<style>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f3f3f3;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.ticket-container {
    max-width: 500px;
    width: 100%;
    text-align: center;
}
.ticket {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    display: inline-block;
    text-align: left;
}
h1 {
    color: #333;
    margin-bottom: 20px;
}
p {
    margin: 10px 0;
    color: #666;
    line-height: 1.5;
}
strong {
    font-weight: bold;
}
.event-info {
    border-top: 1px solid #ccc;
    padding-top: 20px;
}
.event-info p:first-child {
    margin-top: 0;
}
</style>
<div class="ticket">
    <h1>Билет</h1>
    <p><strong>Мероприятие:</strong> ${ticket.event.title}</p>
    <p><strong>Дата:</strong> ${new Date(ticket.event.date).toLocaleDateString()}</p>
    <p><strong>Описание:</strong> ${ticket.event.description}</p>
    <p><strong>Билет ID:</strong> ${ticket._id}</p>
    <p><strong>Пользователь:</strong> ${ticket.user.name} ${ticket.user.surname}</p>
</div>
`;

        // Параметры для html-pdf
        const pdfOptions = {
            format: 'A4',
            orientation: 'portrait'
        };

        // Создаем PDF из HTML-шаблона
        pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
            if (err) {
                console.error('Ошибка при создании PDF:', err);
                res.status(500).send({ message: 'Internal Server Error' });
            } else {
                // Отправляем PDF файл клиенту
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=ticket.pdf');
                res.send(buffer);
            }
        });
    } catch (error) {
        console.error('Ошибка при загрузке билета:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/tickets/:id', async(req, res) => {
    const userId = req.params.id;
    const tickets = await Ticket.find({ user: userId }).populate('event');
    res.send(tickets);
});

app.listen(4444, () => {
    console.log('Сервер запущен');
});