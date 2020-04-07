const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// default options - fileupload
// app.use (fileUpload());
app.use(fileUpload({ useTempFiles: true }));



app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Validar tipo.
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(200).json({
            ok: false,
            err: {
                message: "Los tipos permitidos son :" + tiposValidos.join(", "),
                tipo: tipo
            }
        });
    }



    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split(".");
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extenciones permitidas.
    let extValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las textenciones permitidas son ' + extValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre de archivo.
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;



    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Aqui ya la imagen va cargada.
        // Actualizar Img de Usuario.
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });
})

function imagenUsuario(idUser, res, nombreArchivo) {
    Usuario.findById(idUser, (err, usuariobd) => {
        if (err) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuariobd) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe."
                }
            });
        }
        borraArchivo(usuariobd.img, 'usuarios');
        usuariobd.img = nombreArchivo;
        usuariobd.save((err, usuarioguardado) => {
            res.json({
                ok: true,
                usuario: usuarioguardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productodb) => {
        if (err) {
            borraArchivo(nombreArchivo, "productos");
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productodb) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe."
                }
            });
        }
        borraArchivo(productodb.img, 'usuarios');
        productodb.img = nombreArchivo;
        productodb.save((err, productoguardado) => {
            res.json({
                ok: true,
                producto: productoguardado,
                img: nombreArchivo
            });
        });
    });
}


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(
        __dirname,
        `../../uploads/${tipo}/${nombreImagen}`
    );
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;