//=======================
// PUERTO
//=======================

process.env.PORT = process.env.PORT || 8080;


// ====================================================
// ENTORNO PARA VALIDAR SI ES LOCAL O NUBE
// ====================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================================
// BASE DE DATOS
// ====================================================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.Mongo_URI;
}


// ====================================================
// VENCIMIENTO DEL TOKEN
// ====================================================
// 60 Segundos
// 60 Minutos
// 24 Horas
// 30 Días
process.env.Caducidad_Token = 60 * 60 * 24 * 30;

// ====================================================
// SEED DE AUTENTICACION
// ====================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


// ===================================================
// GOOGLE CLIENT ID
// ===================================================
process.env.CLIENT_ID =
    process.env.CLIENT_ID ||
    "16420894237-chusa8ao4qb3vbtofne86vbuhvbdc852.apps.googleusercontent.com";


process.env.URLDB = urlDB