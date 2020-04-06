const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
let app = express();

let Producto = require('../models/producto');



// ==============================
// Obtener todos los productos.
// ==============================
// 1.- Trae todos los productos.
// 2.- populate: usuario categoria.
// 3.- Paginado
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos: productos
            })
        });
});
// ==============================
// Obtener producto por id
// ==============================
// 1.- populate : usuario categoria.
// 2.- paginado.
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productobd) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!productobd) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id No existe.'
                    }
                });
            }
            res.json({
                ok: true,
                productos: productobd
            });
        });
});

// ==============================
// BUSCAR PRODUCTOS
// ==============================
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Producto.find({ nombre: regex })
        .populate("categoria", "nombre")
        .exec((err, productobd) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productobd
            });
        });
});


// ==============================
// Crear un nuevo producto.
// ==============================
// 1.- Grabar el usuario
// 2.- grabar una categoria del listado.
app.post('/productos/', verificaToken, (req, res) => {

    let body = req.body;
    let idUser = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre, //Requerido
        precioUni: body.precioUni, // requerido
        descripcion: body.descripcion, // No requerida.
        //disponible: '', // requerido , default:true
        categoria: body.categoria, //requerido
        usuario: idUser //requerido.
    });

    producto.save((err, objproducto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!objproducto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: objproducto
        })
    });
});

// ==============================
// Actualizar un producto.
// ==============================
// 1.- Grabar el usuario
// 2.- grabar una categoria del listado.
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // let descProducto = new Producto({
    //     nombre: body.nombre, //Requerido
    //     precioUni: body.precioUni, // requerido
    //     descripcion: body.descripcion, // No requerida.
    //     disponible: body.disponible, // requerido , default:true
    //     categoria: body.categoria, //requerido
    // });
    Producto.findById(id, (err, productobd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productobd) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'EL id no existe.'
                }
            });
        }

        productobd.nombre = body.nombre;
        productobd.precioUni = body.precioUni;
        productobd.categoria = body.categoria;
        productobd.descripcion = body.descripcion;
        productobd.disponible = body.disponible;


        productobd.save((err, productoguardad) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoguardad
            });
        })
    });
});

// ==============================
// Borrar un producto.
// ==============================
// 1.- Borrado Logico.
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productobd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productobd) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "EL id no existe."
                }
            });
        }

        productobd.disponible = false;
        productobd.save((err, productoborrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoborrado,
                message: 'Producto borrado.'
            });
        });
    });
});




module.exports = app;