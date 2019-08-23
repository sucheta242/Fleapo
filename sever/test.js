const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const port = 3000;
const uri = "mongodb+srv://admin:sucheta@24@cluster0-mggyz.mongodb.net/test?retryWrites=true&w=majority";
const database = "fleadb";
const users = "users";
const items = "images";

const app = express();
const client = new MongoClient(uri, { useNewUrlParser: true });

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

client.connect(err => {
	if (err)
		throw err;
	else {
		conn = client.db(database);
		app.listen(port, () => {
			console.log("Server on " + port);
		});
	}
});

app.get("/signup", (req, res) => {
	let username = req.query.username;
	let password = req.query.password;

	if (username != '' && password != '') {
		let abc = [{
			"user": username,
			"pass": password
		}];
		insertData(users, abc, res);
	}

});

app.get("/login", (req, res) => {
	let username = req.query.username;
	let password = req.query.password;

	if (username != '' && password != '') {
		let abc = {
			"user": username,
			"pass": password
		};
		findData(users, abc, res);
	}

});

app.get("/addImages", (req, res) => {
	let image = req.query.image;
	let user = req.query.user;
	if (item != '') {
		let abc = [{
			"image": image,
			"user": user
		}];
		insertData(images, abc, res);
	}
});

app.get("/viewImages", (req, res) => {
	let username=req.query.user;
	let abc = {"user":username};
	findData(images, abc, res);
});


app.get("/deleteImages", (req, res) => {
	let image = req.query.image;
	if (image != '') {
		let abc = {
			"image": image
		};
		deleteData(images, abc, res);
	}
});

app.get("/updateUser", (req, res) => {
	let user = req.query.user;
	let oldPass = req.query.oldPass;
	let newPass = req.query.newPass;
	if (user != '' && oldPass != '' && newPass != '') {
		let oldUser = {
			"user": user,
			"pass": oldPass
		};
		let newUser = {
			"user": user,
			"pass": newPass
		}
		updateData(users, oldUser, newUser, res);
	}
});

function findData(colName, data, res) {
	conn.collection(colName).find(data).toArray((err, result) => {
		if (result.length > 0) {
			res.send({ "status": "ok", "data": result });
		}
		else {
			res.send({ "status": "ok", "data": [] });
		}
	})
}

function insertData(colName, data, res) {
	conn.collection(colName).insertMany(data, (err, result) => {
		if (data.length == result.insertedCount) {
			res.send({ "status": "ok" });
		}
		else {
			res.send({ "status": "fail" });
		}
	})
}

function deleteData(colName, data, res) {
	conn.collection(colName).deleteMany(data, (err, result) => {
		if (result.deletedCount > 0) {
			res.send({ "status": "ok" });
		}
		else {
			res.send({ "status": "fail" });
		}
	})
}

function updateData(colName, data, changes, res) {
	let dataChange = {
		'$set': changes
	};
	conn.collection(colName).updateOne(data, dataChange, (err, result) => {
		console.log('matched count:', result.matchedCount);
		console.log('rows modified:', result.result.nModified);
		if (result.matchedCount > 0) {
			if (result.result.nModified == 1) {
				res.send({ "status": "data modified successfully" });
			}
			else {
				res.send({ "status": "data not modified" });
			}
		}
		else {
			res.send({ "status": "data not found" });
		}
	})
}
