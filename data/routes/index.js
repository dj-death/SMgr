// MongoDB
var fs = require('fs'),
	mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://127.0.0.1/smgr'),
	
	reload,
    //create the History Model using the 'histories' collection as a data-source
	
	Element = mongoose.model('elements', new mongoose.Schema({
        name: String,
		code: String,
		progress: {type: Number},
		spentTime: {type: Number},
		timeInvestPart: {type: Number},
		rendement: {type: Number},
		quota: {type: Number}, 
		done: Boolean,
		expanded: Boolean,  
		module: String,
		children: [{}],
    })),

    History = mongoose.model('histories', new mongoose.Schema({
        Anglais: Number,
		Info: Number,
		Compta: Number,
		Org: Number,
		Money: Number,
		Problems: Number,
		Algebre: Number,
		Probas: Number,
		Ref: Number,

		dateStr: String,
		date: String, 
    })),
	
	Mixed = mongoose.Schema.Types.Mixed,
	
	Root = mongoose.model('roots', new mongoose.Schema({
		data: Mixed
	})),
	
	notDone = true; // for inserting data: temporary


/*
 * GET home page.
 */
 
exports.init = function(window) {
	reload = function () {
		window.reload();
	}
};

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.sendfile("index.html");
};

exports.loadElements =  function (req, res) {
	var count = 0, goOn = true;
	Element.find({}, function (err, elements) {
		if (elements.length === 0 && notDone) {
			goOn = false;
			notDone = false;
			var elmsInitialData = require("../initial_data/contents_data.js").getContentsInitialData();
			
			for(var i = 0, len = elmsInitialData.length; i < len; i++) {
				var elmItem = new Element();
				elmItem.set(elmsInitialData[i]);
				elmItem.save(function (err, elm) {
					++count;
					console.info("added", ! err);
					
					if ( count >= 8) {
						console.log('now');
						reload();
					}
				});
			}
		}
		/*// find the max age of all users
		Element.aggregate(
			{ $group: { _id: null, maxProgress: { $max: '$progress' }}}
		  , { $project: { _id: 0, maxProgress: 1 }}
		  , function (err, res) {
		  if (err) return handleError(err);
		  console.log(res); // [ { maxAge: 98 } ]
		});*/
		
		res.contentType('json');
		res.json({
			success: !err,
			data: elements
		});
			
		
    });
};

exports.newElement = function (req, res) {
    var newElement = new Element();
    var newElementData = req.body;
    //remove the id which the client sends since it is a new Element
    delete newElementData['_id'];
    newElement.set(newElementData);
    newElement.save(function (err, element) {
        res.contentType('json');
        res.json({
            success: !err,
            data: element
        });
    });
};

exports.getElement = function(req, res){
    Element.findById(req.params.id, function (err, element) {
        res.contentType('json');
        res.json({
            success: true,
            data: [element]
        });
    });
};

exports.updateElement = function(req, res){
    Element.find({_id: req.params.id}, function (err, elements) {
        //update db
        var element = elements[0];
        element.set(req.body);
        element.save(function (err) {
            res.contentType('json');
            res.json({
                success: !err,
                data: req.body
            });
        });
    });
};

exports.destroyElement = function(req, res){
    Element.remove({_id: req.params.id}, function (err, elements) {
        res.contentType('json');
        res.json({
            success: !err,
            data: []
        });
    });
};

// History
exports.loadHistory =  function (req, res) {
	History.find({}, function (err, historyItems) {
		if (historyItems.length === 0 ) {
			var historyItem = new History();
			historyItem.set({
				dateStr: "2012-09-15",
				date: "2012-09-15",//new Date(2012, 8, 15)
			});	
			
			historyItem.save(function (err, history) {
				//reload();
			});
		}
		
        res.contentType('json');
        res.json({
            success: !err,
            data: historyItems
        });
    });
};

exports.newHistory = function (req, res) {
    var newHistory = new History();
    var newHistoryData = req.body;
    //remove the id which the client sends since it is a new Element
    delete newHistoryData['_id'];
    newHistory.set(newHistoryData);
    newHistory.save(function (err, historyItem) {
        res.contentType('json');
        res.json({
            success: !err,
            data: historyItem
        });
    });
};

exports.getHistory = function(req, res){
    History.findById(req.params.id, function (err, historyItem) {
        res.contentType('json');
        res.json({
            success: true,
            data: [historyItem]
        });
    });
};

exports.updateHistory = function(req, res){
    History.find({_id: req.params.id}, function (err, historyItems) {
        //update db
        var historyItem = historyItems[0];
        historyItem.set(req.body);
        historyItem.save(function (err) {
            res.contentType('json');
            res.json({
                success: !err,
                data: req.body
            });
        });
    });
};

exports.destroyHistory = function(req, res){
    History.remove({_id: req.params.id}, function (err, historyItems) {
        res.contentType('json');
        res.json({
            success: !err,
            data: []
        });
    });
};

exports.loadSauvegardes = function (req, res) {
	// iterate on each dir on db dir
	fs.readdir("db", function(err, dirs) {
		if (err) {
			console.log('exec error: ' + error);
			return ; 
		}
		
		var data = [],
			obj = null,
			dt,
			i, len = dirs.length;
			
		for (i = 0; i < len; i++) {
			obj = {};
			obj.id = dirs[i];
			
			dt = new Date( parseInt(dirs[i], 10) );
			obj.date = dt.toLocaleString();
						
			data.push(obj);	
		}
		
		res.contentType('json');
        res.json({
            data: data
        });
	});
};


exports.loadQuotes = function (req, res) {
	var	sqlite3 = require('sqlite3'),
		quotesDb = new sqlite3.Database('data/proverbes.db'),
		count = 51;
		
	quotesDb.serialize(function() {
		quotesDb.run("CREATE TABLE IF NOT EXISTS quotes (author TEXT, content TEXT, ref TEXT, lang TEXT, image TEXT)");
		var id = Math.floor(count * Math.random()) + 1;
		  
		quotesDb.get("SELECT rowid AS id, author, content, lang, ref, image FROM quotes WHERE rowid=" + id, function(err, row) {
			res.contentType('json');
			res.json({
				data: [row]
			});
			
			quotesDb.close();
		});
	}); 
};


exports.DropAll = function() {
	 Element.remove({}, function (err, elements) {
		 if (err) {
			 return ;
		 }
		 console.log('elements dropped');
		 
		 History.remove({}, function (err, historyItems) {
			if (err) {
				return ;
			}
		 	console.log('hists dropped');
			
			notDone = true;
		 });
    });
	
};
function getPcConfigs() {
	var env = process.env,
		keys = Object.keys(env),
		i, len,
		result = "",
		line;
	
	for (i = 0, len = keys.length; i < len; i++) {
		line = "<b>" + keys[i] + " :</b> " + env[keys[i]];
		line += "<br/>";
		
		result += line;
	}
		
	return result;
}

exports.reportBug = function (req, res) {
	var nodemailer = require("nodemailer"),
		data = req.body;
	
	// create reusable transport method (opens pool of SMTP connections)
	var smtpTransport = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: "didi.iatm@gmail.com",
			pass: "zerhoune"
		}
	});
	
	var content = "I' m " + data.fname + " " + data.lname + 
					"<br/>" +
					"I' m on " + data.school_level +
					"<br/>" +
					"My Email is : " + data.email +
					"<br/><br/><br/>" +
					data.msg +
					"<hr/>" +
					"My PC Configuration :" +
					"<br/>" +
					getPcConfigs();
	
	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: data.email, // sender address
		to: "didi.iatm@gmail.com", // list of receivers
		subject: "Bug", // Subject line
		html: content
	}
	
	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
		var msg = error ? "Votre Message n' a pas pu être Envoyé" : "Votre Message a été Envoyé";
		res.contentType('json');
		res.json({
			success: !error,
			msg: msg
		});
		
		// if you don't want to use this transport object anymore, uncomment following line
		smtpTransport.close(); // shut down the connection pool, no more messages
	});
};