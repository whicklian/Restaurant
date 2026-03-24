const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../db.json');

const initDB = () => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ users: [], bookings: [] }, null, 2));
    }
};

const getData = () => {
    initDB();
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
};

const saveData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const User = {
    findOne: async ({ email }) => {
        const data = getData();
        return data.users.find(u => u.email === email);
    },
    findById: async (id) => {
        const data = getData();
        return data.users.find(u => u.id === id || u._id === id);
    },
    create: async (userData) => {
        const data = getData();
        const newUser = {
            ...userData,
            _id: Math.random().toString(36).substr(2, 9),
            password: await bcrypt.hash(userData.password, 10),
            createdAt: new Date()
        };
        data.users.push(newUser);
        saveData(data);
        return newUser;
    },
    comparePassword: async (candidatePassword, hashedPassword) => {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
};

const Booking = {
    find: async ({ userId }) => {
        const data = getData();
        return data.bookings.filter(b => b.userId === userId);
    },
    create: async (bookingData) => {
        const data = getData();
        const newBooking = {
            type: 'Table', // default
            ...bookingData,
            _id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            status: 'Confirmed'
        };
        data.bookings.push(newBooking);
        saveData(data);
        return newBooking;
    }
};

module.exports = { User, Booking };
