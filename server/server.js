require('./config/config')

const express = require('express');
const mongoose = require('mongoose');

const app = express();


const bodyParser = require('body-parser');

// prse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.use(require("./routes/usuario"));

//Conexion de la bd de mongo.
// mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
//     if (err) throw err;
//     console.log('Base de datos ONLINE');
// });

mongoose.connect(
    process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) {
            console.log("Error al iniciar la conexión a la base de datos.");
            throw err;
        }
        console.log("Conectado a la base de datos.");
    }
);

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto`, process.env.PORT);
});