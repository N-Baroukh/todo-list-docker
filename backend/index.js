const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET = process.env.JWT_SECRET || 'dev_secret_key';

app.use(cors());
app.use(express.json());

// Connexion Postgres
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});

// Modèles SQL
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
});

const Task = sequelize.define('Task', {
    text: { type: DataTypes.STRING, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Relation : Un utilisateur a plusieurs tâches
User.hasMany(Task);
Task.belongsTo(User);

// Middleware Auth
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;
        next();
    } catch (e) { res.status(401).send({ error: 'Auth requise' }); }
};

// Routes Auth
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        await User.create({ username: req.body.username, password: hashedPassword });
        res.status(201).send({ message: "OK" });
    } catch (e) { res.status(400).send({ error: "Pseudo déjà pris" }); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({ error: 'Invalide' });
    }
    const token = jwt.sign({ id: user.id }, SECRET);
    res.send({ token });
});

// Routes Tasks
app.get('/tasks', auth, async (req, res) => {
    const tasks = await Task.findAll({ where: { UserId: req.userId } });
    res.json(tasks);
});

app.post('/tasks', auth, async (req, res) => {
    const task = await Task.create({ text: req.body.text, UserId: req.userId });
    res.json(task);
});

app.delete('/tasks/:id', auth, async (req, res) => {
    await Task.destroy({ where: { id: req.params.id, UserId: req.userId } });
    res.json({ message: "Supprimé" });
});

// Sync DB et lancement
sequelize.sync().then(() => {
    app.listen(3000, () => console.log("Backend Postgres sur 3000"));
});