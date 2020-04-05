const jwt = require('jsonwebtoken');

// =========================
// Verificar toke.
// =========================
let verificaToken = (req, res, next) => {
    let token = req.get("Authorization");
    // console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Token no válido.'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    // console.log(usuario);
    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: "El usuario no es administrador."
            }
        });
    }



};
// =========================
// Verificar rol del usuario.
// =========================

module.exports = {
    verificaToken,
    verificaAdmin_Role
};