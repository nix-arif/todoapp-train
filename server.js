let express = require('express')
let mongodb = require('mongodb')
let app = express()
let db

app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

let connectionString = 'mongodb+srv://todoAppUser:arif@cluster0-dwjsc.mongodb.net/TodoApp?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useUnifiedTopology: true}, function(err, client) {
    db = client.db()
    app.listen(3000)
})

app.get('/', function(req, res) {
    db.collection('items').find().toArray(function(err, items) {
        res.send(`
        <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ToDoApp</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</head>

<body>
<div class="container">
    <h1 class="display-4 text-center py-1">TODO APP ARIF</h1>

    <div class="jumbotron p-3 shadow-sm">
        <form action="/create-item" class="d-flex align-items-center" method="POST">
            <input type="text" class="form-control mr-3" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
        </form>
    </div>

    <ul class="list-group">
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">Hello</span>
            <div>
                <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
        </li>
    </ul>
</div>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/browser.js"></script>
</body>
</html>
        `)
    })
})

app.post('/create-item', function(req, res) {
    db.collection('items').insertOne({text: req.body.item}, function() {
        res.redirect('/')
    })
})