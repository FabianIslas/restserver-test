const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();


app.post("/login", (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos."
                }
            });
        }

        let token = jwt.sign({
            usuario: user
        }, process.env.SEED, { expiresIn: process.env.Caducidad_Token });

        res.json({
            ok: true,
            usuario: user,
            token: token
        })
    });
});






module.exports = app;



module.exports = app;