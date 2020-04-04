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
    urlDB = 'mongodb+srv://watfor:13twDverxd3FHdSX@cluster0-nfnxw.mongodb.net/test';
}

process.env.URLDB = urlDB