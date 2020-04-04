//================================
// Modelo para crear el esquema de la bd.
//================================

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del usuario es requerido."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo del usuario es necesario."]
    },
    password: {
        type: String,
        required: [true, "El password es obligatoria."]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único.' });

module.exports = mongoose.model('Usuario', usuarioSchema);