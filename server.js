var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const flash = require('express-flash');
const session = require('express-session');
mongoose.connect('mongodb://localhost/27017');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(session({
    secret: 'yaddayadda',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000 }
}))

var Cats = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255 },
    age: { type: Number, required: true, max: 50 },
    color: { type: String, required: true, maxlength: 255 }
});

mongoose.model('Cats', Cats);
var Cats = mongoose.model('Cats');

app.get('/', function (req, res) {
    Cats.find({}, function (err, Cats) {
        res.render('index', { Cats: Cats });
    })
})

app.get('/Cats/new', function (req, res) {
    res.render('new');
})

app.get('/Cats/:id', function (req, res) {
    Cats.findOne({ _id: req.params.id }, function (err, Cats) {
        res.render('single', { Cats: Cats });
    })
})

app.get('/Cats/edit/:id', function (req, res) {
    Cats.findOne({ _id: req.params.id }, function (err, Cats) {
        res.render('edit', { Cats: Cats });
    })
})

app.post('/Cats/create', function (req, res) {
    Cats.create(req.body, function (err, Cats) {
        if (err) {
            for (var key in err.errors) {
                req.flash('create', err.errors[key].message);
            }
            res.redirect('/Cats/new');
        }
        else {
            res.redirect('/');
        }
    })
})

app.post('/Cats/update', function (req, res) {
    Cats.findOne({ _id: req.body.id }, function (err, Cats) {
        if (err) {
            for (var key in err.errors) {
                req.flash('update', err.errors[key].message);
            }
            res.redirect('/Cats/edit/' + req.body.id);
        }
        else {
            Cats.name = req.body.name;
            Cats.age = req.body.age;
            Cats.color = req.body.color;

            Cats.save(function (err) {
                res.redirect("/");
            })
        }
    }
    
    )
})

app.get('/Cats/delete/:id', function (req, res) {
    Cats.remove({ _id: req.params.id }, function (err, Cats) {
        res.redirect('/');
    })
})


app.listen(8000, function () {
    console.log("listening on port 8000");
})