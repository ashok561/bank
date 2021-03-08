const express = require('express');

const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'})

const connectdb = require('./config/db');
connectdb();
const auth = require('./routes/auth');
const transaction = require('./routes/transaction');
const errorHandler = require('./middleware/error');
const app = express();

app.use(express.json());
app.use('/api/v1/auth', auth);
app.use('/api/v1/transaction', transaction);
app.use(errorHandler);
const server = app.listen(process.env.PORT, console.log('server connected'));

process.on('unhandledRejection', err=>{
    server.close(process.exit(1))
})