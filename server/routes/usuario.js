const express = require("express");
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion");

const app = express();


// Obtiene los registros con filtros de limite por pagina y desde que elemento en adelante traera.
app.get("/usuario", verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, "nombre email role estado google img")
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    count: count
                });
            });
        });
});
//Agrega un registro
app.post("/usuario", [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, objUsuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // objUsuario.password = null;
        res.json({
            ok: true,
            usuario: objUsuario
        });
    });
});

// Actualiza un registro.
app.put("/usuario/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    );
});

app.delete("/usuario/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let objUsuario = {
        estado: false
    };
    // Usuario.findByIdAndRemove(id, (err, user) => {
    Usuario.findByIdAndUpdate(id, objUsuario, { new: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado."
                }
            });
        }
        res.json({
            ok: true,
            usuario: user
        });
    });
});


module.exports = app;