const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Exportaciones de google
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//
// Configuracion de google
//

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post("/google", async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });
    if (!googleUser) { return; }
    Usuario.findOne({ email: googleUser.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (user) {
            if (user.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal.'
                    }
                });
            } else {
                let token = jwt.sign({ usuario: user }, process.env.SEED, { expiresIn: process.env.Caducidad_Token });

                return res.json({
                    ok: true,
                    usuario: user,
                    token
                })
            }

        } else {
            // Si el usuario no existe en la bd .
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuariobd) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({ usuario: usuariobd }, process.env.SEED, { expiresIn: process.env.Caducidad_Token });

                return res.json({
                    ok: true,
                    usuario: usuariobd,
                    token
                });
            });
        }
    });
});



module.exports = app;