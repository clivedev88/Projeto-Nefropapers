require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { validateApiKey } = require('./middlewares/authMiddleware');
const apiKeyController = require('./controllers/apiKeyController');

const app = express();

const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];  
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
}));


app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const simulationRoutes = require('./routes/simulationRoutes');

app.use('/auth', authRoutes);  
app.post('/generate-api-key', validateApiKey, apiKeyController.gerarApiKey); 
app.use('/usuarios', validateApiKey, userRoutes);  
app.use('/cursos', validateApiKey, courseRoutes);  
app.use('/modulos', validateApiKey, moduleRoutes);  
app.use('/provas', validateApiKey, quizRoutes);  
// app.use('/questoes', validateApiKey, questionRoutes);  
app.use('/questoes', validateApiKey, questionRoutes);
app.use('/simulados', validateApiKey, simulationRoutes);  

app.get('/', (req, res) => {
    res.send('Backend funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
    console.log(`Servidor disponível em: http://localhost:${PORT}`);
});
