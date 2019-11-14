const bcrypt = require('bcryptjs');

const helpers = {}; //Creación del objeto

//Método primer logeo
helpers.encryptPassword = async(password) => { //Función asíncrona
    //Genera un hash: '(10)' #veces que se ejecutará el ciclo. 
    //A mayor cantidad de ejecución más seguridad obtiene el cifrado.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//Método comparción entre la contraseña que se ingresa con 'primer logeo'
helpers.matchPassword = async(password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};


module.exports = helpers;