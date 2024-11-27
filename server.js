const express = require('express');
// const fs = require('node:fs/promises');
// const assert = require('assert');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require('mongoose');
const app = express();

const uri = 'mongodb+srv://tester:tester123@cluster0.3veso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'sample_onlinebookshop';
const collectionName = 'book';
let client = new MongoClient(uri);
let database = null;

const bookSchema = require('./models/book');
const books = mongoose.model('book', bookSchema);

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

//parsing post data to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRETKEY = 'COMPS381W';

const users = new Array(
	{name: 'admin1', password: 'admintest1', state: 'admin'},
	{name: 'user1', password: 'usertest1', state: 'user'}
);

app.use(session({
    name: 'loginSession',
    keys: [SECRETKEY],
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        expires: false
    },
}));

//database connection
const dbconnection = async function() {
    try{
        await client.connect();
        console.log('Connected successfully to the MongoDB database server.');
        database = await client.db(dbName);
        console.log('Connected successfully to the database.');
    }catch(error){
        console.error('Error connecting to MongoDB:', error);
    }
}
//database close connection 
const closeConnection = async function(){
    try{
        await client.close();
        console.log('Closed db connection');
    }catch(error){
        console.error('close connection error: ', error);
    }
}

const createbook = async function(body, callback){
    try{
        await dbconnection();
        let document = {};

        document["bookName"] = body.bookName;
        document["author"] = body.author;
        document["price"] = body.price;
        document["bookDescription"] = body.bookDescription;

        await database.collection(collectionName).insertOne(document);
        await closeConnection();
        callback(document);
    }catch(error){
        await closeConnection();
        console.error('create docs error: ', error )
    }
}

const findDocument = async (db, criteria) => {
	let findResults = [];
	let collection = db.collection(collectionName);
	console.log(`findCriteria: ${JSON.stringify(criteria)}`);
   	findResults = await collection.find(criteria).toArray();
	console.log(`findDocument: ${findResults.length}`);
	console.log(`findResults: ${JSON.stringify(findResults)}`);
	return findResults;
};

const findbook = async (db, criteria) => {
	let findResults = [];
    // const bookfind = await books.find({author:});
	// let collection = db.collection(collectionName);
	console.log(`findCriteria: ${JSON.stringify(criteria)}`);
   	findResults = await bookfind.find(criteria).toArray();
	console.log(`findDocument: ${findResults.length}`);
	console.log(`findResults: ${JSON.stringify(findResults)}`);
	return findResults;
};

const updateDocument = async (db, criteria, updateDoc) => {
    let updateResults = [];
	let collection = db.collection(collectionName);
	console.log(`updateCriteria: ${JSON.stringify(criteria)}`);
   	updateResults = await collection.updateOne(criteria,{$set : updateDoc}, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
	console.log(`updateResults: ${JSON.stringify(updateResults)}`);
	return updateResults;
}

const Home_Find = async (res, criteria) => {
    try{    
        await dbconnection();
        const docs = await findDocument(database, criteria);
	    await closeConnection();
        res.status(200).render('home',{Bookl: docs.length, books: docs});
    }catch(error){
        await closeConnection();
        console.error('find docs error: ', error )
    }        
}

const Book_Find = async (req, res, criteria) => {
    try{
        await dbconnection();
        console.log(req.body);
        let findResults = [];
        let collection = database.collection(collectionName);
        findResults = await collection.find(req.body).toArray();
        console.log(findResults);
        res.status(200).render('find-R', {books: findResults});
    }catch(error){
        await closeConnection();
        console.error('find docs error: ', error )
    } 
}

const book_Details = async (res, criteria) => {
    try{
        await dbconnection();
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = new ObjectId(criteria._id);
	    const docs = await findDocument(database, DOCID); 
	    await closeConnection();
        res.status(200).render('bookdetail', {book: docs[0]});
    }catch(error){
        await closeConnection();
        console.error('find docs error: ', error )
    }  
}

const book_Edit = async (res, criteria) => {
    try{
        await dbconnection();
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = new ObjectId(criteria._id)
        console.log(DOCID);
	    const docs = await findDocument(database, DOCID); 
	    await closeConnection();
        res.status(200).render('update',{book: docs[0]});
    }catch(error){
        await closeConnection();
        console.error('find docs error: ', error )
    } 
}

const book_Update = async (req, res, criteria) => {
    try{
        await dbconnection();
        console.log(req.body);
        let DOCID = {};
        DOCID['_id'] = new ObjectId(req.body._id);
        console.log(DOCID);
        var updateDoc = {};
        updateDoc["bookName"] = req.body.bookName;
        updateDoc["author"] = req.body.author;
        updateDoc["price"] = req.body.price;
        updateDoc["bookDescription"] = req.body.bookDescription;
        console.log(updateDoc);
        const results = await updateDocument(database, DOCID, updateDoc);
		await closeConnection();
		Home_Find(res, req.query.docs);
    }catch(error){
        await closeConnection();
        console.error('update docs error: ', error )
    } 
}

const delete_book = async function(id, callback){
    try{
        await dbconnection();
        await database.collection(collectionName).deleteOne({'_id': new ObjectId(id)});
        callback();
    }catch(error){
        throw error;
    }
}
//handle request
app.get("/", (req,res) => {
    if(!req.session.authenticated){
        return res.redirect('/login');
    }
    else {
        return Home_Find(res, req.query.docs);
    }
});

app.get("/login", (req,res) => {
    return res.status(200).render('login',{});
});

app.post('/login', async (req, res) => {
    users.forEach((user) => {
        if(user.name == req.body.username && user.password == req.body.password){
            req.session.authenticated = true;
            req.session.username = req.body.username;
            console.log(req.session.username)
        }
    })
    if(!req.session.authenticated){
        res.render('login',{msg: 'wrong username or password'});
    }
    if(req.session.authenticated){ //render to home page
        Home_Find(res, req.query.docs);
    }
});

app.get('/logout', (req, res) => {
    req.session = null;
    return res.redirect('/login');
});

app.get("/home", async (req, res) => {
    Home_Find(res, req.query.docs);
});

app.get("/create", (req, res) => {
    return res.status(200).render('create');
});

app.post("/create", async (req, res) => {
    createbook(req.body,function(formated){
        console.log(formated);
        console.log('successful insert one data');
        Home_Find(res, req.query.docs);
    });
}); 

app.get("/find", (req, res) => {
    return res.status(200).render('find');
});

app.post("/find", (req, res) => {
    // let bf = [];
    Book_Find(req, res, req.query);
    //console.log(bf);
});

app.get('/detail', (req,res) => {
    book_Details(res, req.query);
})

app.get('/update', (req,res) => {
    book_Edit(res, req.query);
})

app.post('/update', async (req,res) => {
    book_Update(req, res, req.query);
})

app.get('/delete', function (req, res) {
    console.log(new ObjectId(req.query._id));
    try{
        delete_book(req.query._id, function(){
            console.log('delete successful');
            Home_Find(res, req.query.docs);
        })
    }catch(error){
        console.log(error);
        Home_Find(res, req.query.docs);
    }
});

//clear session
app.get('/session/destroy', function(req, res) {
    req.session = null;
    res.status(200).send('ok');
});

const server = app.listen(process.env.PORT || 8099, () => {

    const port = server.address().port;
    console.log(`Server listening at port ${port}`);
});