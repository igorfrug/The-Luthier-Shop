const express = require('express');
const app = express()
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/users', require('./routes/users'))
app.use('/orders', require('./routes/orders'))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});





app.listen(2222, () => console.log("2222 is UP!"))