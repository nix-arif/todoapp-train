let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')
let app = express()
let db

app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(express.json())

let port = process.env.PORT

if (port == null || port == "") {
    port = 3000
}

let connectionString = 'mongodb+srv://todoAppUser:arif@cluster0-dwjsc.mongodb.net/TodoApp?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useUnifiedTopology: true}, function(err, client) {
    db = client.db()
    app.listen(port)
})

function passwordProtected(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
    if (req.headers.authorization == "Basic YXJpZjphcmlm") {
        next()
    } else {
        res.status(401).send("Authentication required")
    }
}

app.use(passwordProtected)

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
        <form id="create-form" action="/create-item" class="d-flex align-items-center" method="POST">
            <input id="create-field" name="item" autocomplete="off" type="text" class="form-control mr-3" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
        </form>
    </div>

    <ul id="item-list" class="list-group"> 
    </ul>
</div>

<script>let items = ${JSON.stringify(items)}</script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/browser.js"></script>
</body>
</html>
        `)
    })
})

app.post('/create-item', function(req, res) {
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
    db.collection('items').insertOne({text: safeText}, function(err, info) {
        res.json(info.ops[0])
    })
})

app.post('/update-item', function(req, res) {
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
    db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
        res.send("Success")
    })
})

app.post('/delete-item', function(req, res) {
    db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
        res.send("Success")
    })
})