const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path'); // Find routes
const flash = require('connect-flash'); //Permite enviar msj
const session = require('express-session'); //Flash require session
const MySQLStore = require('express-mysql-session'); //Guarda la session en la BD
const passport = require('passport');

const { database } = require('./keys'); //Importando el objeto database perteneciente a keys

// initializations
const app = express();
require('./lib/passport');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// The elements to be used are declared 
app.engine('.hbs', exphbs({ //Motor
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //bring the route views with __dirname and join with layouts
    partialsDir: path.join(app.get('views'), 'partials'), //Declaración de las carpetas donde se alojarán archvios. 
    extname: '.hbs', //Indica extensión de terminación de los archivos pertenecientes a Handlebars
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs'); //'.hbs motor name'


//Middlewares
app.use(session({
    secret: 'VictoriasaurioMySQL',
    resave: false, //No vuelve a guardar la session
    saveUninitialized: false, // No inicializa otra sesson igual
    store: new MySQLStore(database) //Referencia la BD donde se guardará los datos
}));
app.use(flash()); // Importando Flash para poder usarlo
app.use(morgan('dev')); // show user requests
app.use(express.urlencoded({ extended: false })); //Recibirá strings sencillos
app.use(express.json());
app.use(passport.initialize()); //Passport inicia
app.use(passport.session());



// Global variables || variables que pueden acceder desde cualquier lugar
app.use((req, res, next) => {
    app.locals.success = req.flash('success'); //Pone al msj disponible en las vistas.
    app.locals.message = req.flash('message');
    app.locals.user = req.user; //datos de sesión del usuario
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/links', require('./routes/links')); //'/links' define la ruta al momento de hacer peticiones

// public
app.use(express.static(path.join(__dirname, 'public'))); //Indica la ruta folder=public

//Starting the server: Use the declared 'PORT'
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});