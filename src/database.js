const mysql = require('mysql');
/* Código de callbacks a promesas - Conversión de módulo NODE */
const { promisify } = require('util');

const { database } = require('./keys'); //Requiero una parte (database)

const pool = mysql.createPool(database); //Ejecuta por partes el código

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (connection) connection.release(); //Avisa sobre conección éxitosa
    console.log('DB is Connected');
    return;
});

pool.query = promisify(pool.query); //Al hacer las consultas se podrá utilizar asynawait o promesas

module.exports = pool; //Conección para poder hacer las consultas