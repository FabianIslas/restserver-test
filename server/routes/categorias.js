const express = require('express');

let {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require('../models/categoria');

// ============================
//Carga las categorias.
// ============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });

});
// ============================
// Mostrar una categoria por id.
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto.'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })
    })
});
// ============================
// Crear nueva categoría.
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria.
    // req.usuario._id
    let body = req.body;
    // console.log(body);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, objCategoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!objCategoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: objCategoria
        });
    });
});
// ============================
// Actualizar categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});
// ============================
// Eliminar categoria.
// ============================
app.delete(
    "/categoria/:id", [verificaToken, verificaAdmin_Role],
    (req, res) => {
        //Solo un administrador puede borrar categorias.
        // Categoria FindByIdAndRemove.
        let id = req.params.id;

        Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El id no existe."
                    }
                });
            }

            res.json({
                ok: true,
                message: "Categoría borrada."
            });
        });
    }
);


module.exports = app;