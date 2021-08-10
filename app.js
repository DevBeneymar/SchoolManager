const express = require('express'),
        app = express(),
        helmet = require('helmet'),
        //bodyParser = require('body-parser'),
        port = process.env.PORT || 5000,
        path = require('path'),
        exphbs= require('express-handlebars'),
        flash = require('connect-flash'),
        session = require('express-session'),
        mongoose = require('mongoose'),
        passport = require('passport')
;

//13- Protection des en-tetes http
app.use(helmet());
    /**
     * Si on veut pas utiliser helmet, on peut desactiver au minimum l’en-tête X-Powered-By.
     * Les intrus peuvent utiliser cet en-tête (activé par défaut) afin de détecter les applications qui exécutent Express et lancer ensuite des attaques spécifiquement ciblées.
     * Il est donc conseillé de neutraliser l’en-tête à l’aide de la méthode app.disable() comme suit :
     * app.disable('x-powered-by');
     * N.B: En utilisant helmet, x-powered-by est desactivee par defaut.
     */

// 10- Database.
    // a) Configuration de la database
    const $db = require('./config/database');
    // b) Connection a la database : Connect to mongoose
    mongoose.connect($db.mongoURI,{
        keepAlive:1,
        useNewUrlParser:true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log('MongoDb Connected...');
    })
    .catch((err)=>{
        console.log(err);
    });

// 0- Configuration du template
    // a)On definit le moteur de template
        app.set('view engine','handlebars');
    // b) Middleware express-handlebars
        app.engine('handlebars',exphbs({
            layoutDir: __dirname + './views/layouts'
        }));
        //defaultLayout:'main' //defaultLayout c'est pour definir une template par defaut

    /*
    On peut aussi definir le folder ou se trouve les templates(layout):
        app.engine('handlebars', handlebars({
        layoutDir: __dirname + '/views/layouts',
        }));
        //Donc, Pour le res.render, on fait:
        app.get('/', function (req, res) {
             res.render('main', {layout : 'index'})
        });
        //main: le nom de la page
        //index : le nom du template

        ***On peut faire aussi:***
        app.set('view engine', 'hbs');

        app.engine( 'hbs', hbs( {
        extname: 'hbs', //l'extension des fichiers doit etre .hbs
        defaultView: 'default',
        layoutDir: __dirname + '/views/pages/',
        partialsDir: __dirname + '/views/partials/'
        }));

    */

// 1- parse application/x-www-form-urlencoded: Pour manipuler les url
app.use(express.urlencoded({ extended: false }));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 2- parse application/json
app.use(express.json());

// 3-Gestion des fichiers static
app.use('/assets',express.static(path.join(__dirname,'public')));

// 7- Flash message Middleware and configuration
/**
 * var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
 * Dans cookie, ajouter: expires: expiryDate
 */
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  secret: 'iamborntowin',
  name:'friendzanmiami',
  keys: ['key@2021', 'key@1202'],
  proxy:true,
  resave: true,
  saveUninitialized: true,
  cookie: { 
      secure: false,
      httpOnly: true,
      path:'/',
      expires: expiryDate
  }
}));

// 12- Passport MIddleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware flash
app.use(flash());
app.use(require('./middlewares/flash'));

// 11- Passport Config
require('./config/passportAdmin')(passport);


// 4- Load route
const students = require('./routes/students'),
      teachers = require('./routes/teachers'),
      managers = require('./routes/managers')
;

// 5- Index Page
app.get('/',(req,res)=>{
    res.render('index',{layout : 'main'});
});

// 6- About Page
app.get('/about',(req,res)=>{
    res.render('about',{layout : 'main'});
});



// 8-Use route
app.use('/students',students);
app.use('/teachers',teachers);
app.use('/managers',managers); 

// 9- Listen Port
app.listen(port,()=>{
    console.log('Server is starting au port: '+port);
});