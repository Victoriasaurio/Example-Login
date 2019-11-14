const passport = require('passport'); //Puedes autenticarte con cuentas de google o RS
const LocalStrategy = require('passport-local').Strategy; //Pero nos autenticaremos de manera local

const pool = require('../database'); //Importando la conexión de la BD
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    // console.log(req.body); //Comprobar los datos que se estan recibiendo
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('message', 'Username does nor exist'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => { //done: permite ejecutar los que sigue después del callback
    const { fullname } = req.body; //Importando desde 'req' la propiedad fullname
    const newUser = {
        username,
        password,
        fullname
    };
    //'newUser.password' llama la variable a usar
    newUser.password = await helpers.encryptPassword(password);
    //Saving in the DATABASE
    const result = await pool.query('INSERT INTO users SET ?', [newUser]); //Insertando datos en la BD
    newUser.id = result.insertId; //Agregando el 'Id' a newUser
    return done(null, newUser); // null:some err and newUser: redirect serializeUser
}));

//serializeUser: saved user in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//Consulta en la BD para saber si el usuario existe
passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});