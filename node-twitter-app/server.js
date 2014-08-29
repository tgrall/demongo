'use strict';

var express = require('express'),
	bson = require('bson'),
	Long = bson.Long,
    MongoClient = require('mongodb').MongoClient;


function pad(num, size){ return ('000000' + num).substr(-size); }

function convertDateToUTCString(theDate) {
	var dateAsString = 	theDate.getUTCFullYear() 
				     +"-"+ ( pad(theDate.getUTCMonth()+1 , 2 )) 
					 +"-"+ pad(theDate.getUTCDate(),2) 
					 +"T"+ pad(theDate.getUTCHours(),2)
					 +":"+ pad(theDate.getUTCMinutes(),2)
					 +":"+ pad(theDate.getUTCSeconds(),2)
					 +"Z";
	return dateAsString;				 	
}

function getDateRange(endDate, level) {
	
	var startDate = new Date(endDate);
	var durationInMinutes = 1;

	startDate.setMinutes(endDate.getMinutes() -  durationInMinutes  );


	if (level == "h" || level == "d") {
		endDate.setMinutes(0);
		durationInMinutes = 60; // 1h time range
		startDate.setMinutes(endDate.getMinutes() -  durationInMinutes  );
	}

	if (level == "d") {
		endDate.setMinutes(0);
		endDate.setHours(1);
		startDate.setMinutes(0);
		startDate.setHours(1);
		startDate.setDate( endDate.getDate() -1 );
	}

	var startDateString = convertDateToUTCString(startDate); // "2014-02-14T11:28:00Z"; // 
	var endDateString = convertDateToUTCString(endDate); // "2014-02-14T11:29:00Z"; // 
	
	return { start : startDateString, end : endDateString };
	
}




MongoClient.connect("mongodb://localhost:27017/twitter", function(err, db) {
	if(err) { return console.dir(err); }

	var messageCollection = db.collection('messages');
	var sentimentCollection = db.collection('sentiments');
	var configCollection = db.collection('config');
	
/**
 * Main application file
 */

// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express();

// Express settings
require('./lib/config/express')(app);



// Tweet by Tag
app.get('/api/tweets/tags/:tag', function(req, res) {
	var filter = { 'entities.hashtags.text' : req.params.tag  };
	var sortOption = {created_at : -1};
	var options = {"limit": 20};
	messageCollection.find( filter , options).toArray(function(err, results){
	    res.send(results); // output all records
	});
});


// Tweet by users
app.get('/api/tweets/user/:user', function(req, res) {
	var filter = { 'user.screen_name' : req.params.user  };
	var sortOption = {created_at : -1};
	var options = {"limit": 20};
	messageCollection.find( filter , options).toArray(function(err, results){
	    res.send(results); // output all records
	});
});


// Get all tags
app.get('/api/tweets/tags/', function(req, res) {
	
	  var query = 	  [
	   {
	   	$unwind : "$entities.hashtags"
	   }
	   ,
	   {
	   	$group : 
	  	{
	  		_id : "$entities.hashtags.text",
	  		count : { $sum : 1 }
	  	}
	   }
	   ,
	   {
	   	$project : { _id : 0, tag : "$_id", count:1 }
	   }
	   ,
	   {
	   	$sort : { count : -1 }
	   }
	   ,
	   {
		   $limit : 100
	   }
	  ]
	  messageCollection.aggregate(
		  query
	  , function(err, result) {
		  var data = {
			  result : result,
			  query : "db.messages.aggregate("+ JSON.stringify(query, undefined, 2) +")"
		  }
		res.send(data);
	  });
});


// get random medias
app.get('/api/tweets/medias', function(req, res) {
	
	var pageNumber = 0;
	var pageSize = 10;
	if (req.query.page &&  req.query.page != "0" ) {
		pageNumber = parseInt(req.query.page) - 1;
	}
	if (req.query.size &&  req.query.size != "5" ) {
		pageSize = parseInt(req.query.size);
	}
	
	var query = [
		{
			$match : {'entities.media' : { $exists: true }}
		}
		,
		{
			$project : { _id:1, id:1, text:1 , 'entities.media.media_url':1  }
		}
		,
		{
			$unwind : "$entities.media"
		}
		,
		{
			$sort : {id:-1}
		}
		,
		{
			$limit : pageSize
		}
		,
		{
			$project : { _id:1,id:1, text:1 , 'url':'$entities.media.media_url'  }
		}
		,
		{
			$group : 
			{
				_id : "$url",
				nb : {$sum : 1},
				tweet_ids : {  $addToSet : "$id"  } 
			}
		}
		,
		{
			$project : { _id : 0, 'url':'$_id' , tweet_ids : 1 }
		}
	 	];
	
	
	messageCollection.aggregate(
		query
  	 	, function(err, result) {
			
			var data =  {
				result : result,
				query :  "db.messages.aggregate("+ JSON.stringify(query, undefined, 2) +")"
			};
			
			res.send(data);
  	  });		
});


// Tweet by user
app.get('/api/stats/tweets_by_user', function(req, res){
	var query = [
	
    {
		$group: {_id: '$user.screen_name', count: {$sum:1} }
	} 
	,
	{
		$project : { screen_name : "$_id", _id :0 , count :1}
	}

	,
    {
		$sort: {"count" : -1}
	}
	,
    {
		$limit: 20
	}	 

	]
	messageCollection.aggregate(
		query
  	 	, function(err, result) {
			
			var data =  {
				result : result,
				query :  "db.messages.aggregate("+ JSON.stringify(query, undefined, 2) +")"
			};
			
			res.send(data);
  	  });		
	
	
});


// Tweet by date (by default aggregated by second)
app.get('/api/stats/tweets_by_date/:level?', function(req, res){
	
	var aggLevel = 6;
	if (req.params.level) {
		aggLevel = parseInt(req.params.level);
		if (aggLevel > 6) {
			aggLevel = 6;
		}
	}

	var projection = {
		 
		};
		
       switch (aggLevel) {
			case (6): projection[6] = {$second: '$created_at'};
			case (5): projection[5] = {$minute: '$created_at'} ;
			case (4): projection[4] 	= {$hour: '$created_at'};  
			case (3): projection[3] 	= {$dayOfMonth: '$created_at'} 
       		case (2): projection[2] 	= {$month: '$created_at'};
   			case (1): projection[1] 	= {$year: '$created_at'}
			
			
        }
	
	var query = [
	{
		$project : {  
			date : projection   
		}
	}
	,
    {
		$group: {_id: '$date', count: {$sum:1} }
	} 
	,
    {
		$sort: {"_id" : -1}
	} 
	,
    {
		$limit: 20
	} 
	]
	
	//TODO : this needs to be cached/limited, good for small dataset
	//		 it won't scale
	messageCollection.aggregate(
		query
  	 	, function(err, result) {
			
			var data =  {
				result : result,
				query :  "db.messages.aggregate("+ JSON.stringify(query, undefined, 2) +")"
			};
			
			res.send(data);
  	  });		
	
	
});


// Count number of messages
app.get('/api/tweets/count', function(req, res) {
	messageCollection.find({},{}).count(function (err, count) {
		res.send( { 'nb_tweets' :  count } );
	});
});


// Get message by ID
app.get('/api/tweets/:id', function(req, res) {
	var id =  Long.fromString(req.params.id);
	
	var query = {"id" : id };
	messageCollection.findOne(query, function(err, document) {
		var data = {
			document : document,
			query : 'db.messages.findOne(' + JSON.stringify(query, undefined, 2) + ')'
		};
		res.send(data);
		
		
		
	});
});


// Get get tweets kind
app.get('/api/loc_tweets/near_point', function(req, res) {
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	var distance = req.query.distance;
	if (longitude) {
		longitude = parseFloat(longitude);
	}
	if (latitude) {
		latitude = parseFloat(latitude);
	}
	if (distance) {
		distance = parseInt(distance);
	}
	var filter = {'coordinates.coordinates':  { $geoWithin: { $centerSphere: [ [longitude, latitude] , distance / 6371 ] } } };

	messageCollection.find(filter).toArray(function(err, results){
		var data = {
			results : results,
			query : "db.messages.find("+ JSON.stringify(filter, undefined, 2) +")"
		};
	    res.send(data); // output all records
	});
});

// Get get tweets kind
app.get('/api/loc_tweets', function(req, res) {
	var pageNumber = 0;
	var pageSize = 100;
	if (req.query.page &&  req.query.page != 0 ) {
		pageNumber = parseInt(req.query.page) - 1;
	}
	if (req.query.size &&  req.query.size != "5" ) {
		pageSize = parseInt(req.query.size);
	}
	
	var filter = { 'geo.type' : 'Point'  };
	var sortOption = {created_at : -1};
	var options = {skip : (pageNumber * pageSize) , "limit": pageSize, sort: sortOption };
	
	messageCollection.find(filter, options ).toArray(function(err, results){
		var data = {
			results : results,
			query : "db.messages.find("+ JSON.stringify(filter, undefined, 2) +").sort("+ JSON.stringify(sortOption, undefined, 2) +").skip("+ (pageNumber * pageSize) +").limit("+ pageSize +")"
		};
	    res.send(data); // output all records
	});
});

// Get get tweets kind
app.get('/api/tweets', function(req, res) {
	var pageNumber = 0;
	var pageSize = 20;
	var skip = 0;
	if (req.query.size &&  req.query.size != "5" ) {
		pageSize = parseInt(req.query.size);
	}
	if (req.query.page &&  req.query.page != '0' ) {
		pageNumber = parseInt(req.query.page) - 1;
		skip = (pageNumber * pageSize)
	}
	
	
	var filter = {};
	var sortOption = {created_at : -1};
	var options = {skip : skip, limit : pageSize, sort: sortOption };

	
	messageCollection.find( filter , options ).toArray(function(err, results){
		var data = {
			results : results,
			query : "db.messages.find("+ JSON.stringify(filter, undefined, 2) +").sort("+ JSON.stringify(sortOption, undefined, 2) +").skip("+ skip +").limit("+ pageSize +")"
		};
	    res.send(data); // output all records
	});
});


// Add meta to the tweet message
app.post( '/api/tweets/meta/:id', function(req, res) {
	var id =  Long.fromString(req.params.id);
	var meta = req.body;
	
	var filter = {"id": id };
	var sort = {dateTime : -1};
	var update = {$set: { meta : meta }};
	var options = { new : true };
	
	messageCollection.findAndModify( filter , sort , update , options, function(err, result) {
		var data = {
			document : result,
			query : 'db.messages.findAndModify( {' +
    				'query : '+ JSON.stringify(filter, undefined, 2) +','+
    				'sort : '+ JSON.stringify(sort, undefined, 2) +','+
    				'update : '+ JSON.stringify(update, undefined, 2) +','+
					'new : true '+
				    '} )'
		};
		
	    res.send(data); // output all records
		
	});
	
});


// Full text search

app.get('/api/search' , function(req,res) {
	var q = req.query.q;
	db.command({'text' : 'messages', search : q, limit : 100 }, function(error,results){
		var data = {
			results : results,
			query : "db.messages.runCommand( 'text' , {search : '"+ q +"', limit:100}  )"
		};
		res.send(data);
	} );
	
});



// Get sentiments
app.get('/api/sentiments/:brand/:level?', function(req, res) {

    var level = req.params.level;
	
	var projection = {
			'ts' : {"$second": "$dateTime"},
			'pos_score' : 1,
			'neg_score' : 1
		}
	
	
	if (level == undefined) {
		level == "mn";
		
	} else 	if (level == "h") {
		projection.ts = {"$minute": "$dateTime"};		
	} else 	if (level == "d") {
		projection.ts = {"$hour": "$dateTime"};		
	}
	
	var brand = req.params.brand;
	var brandFilter = { 'brand' : brand, 'sentiment' : { $in : ['positive', 'negative'] } };
	var options = { 'sort' : [['dateTime','desc']], 'limit' : 1};
	
	
	sentimentCollection.find( brandFilter, {dateTime : 1} , options ).toArray(function(err, tweet){
		
	
	var endDate = new Date();
	if (tweet.length != 0) {
		endDate =  tweet[0].dateTime ;
	}
	var dateRange = getDateRange(endDate, level);
	var startDateString = dateRange.start;
	var endDateString = dateRange.end;
	

	var filter = 
	[
	{
		$match : 
		{ 
			'brand' : brand.toLowerCase(),
			'dateTime' : { $gte : new Date( startDateString ) , $lt : new Date( endDateString ) },
			'sentiment' : { $in : ['positive', 'negative'] }    
		}
	}
	,
	{
		$project : projection

	}	
	,
	{
		$group : 
		{
			_id : "$ts",
			'count' : {$sum :1},
			'pos_score' : {$avg : '$pos_score'},
			'neg_score' : {$avg : '$neg_score'}
		}
	}
	,
	{
		$sort : {"_id" : -1}
	}
	,
	{
		$project :
		{
			'_id' : 0,
			'label' : '$_id',
			'count' : 1,
			'pos_score' : 1,
			'neg_score' : 1
		}
	}
	
	];

	sentimentCollection.aggregate( filter, function(err, results) {
		var data = {
			results : results,
			range : dateRange,
			query : filter
		};
	    res.send(data); // output all records
	});
	
	
	}) // end of query on date
	
	
	
});


app.get('/api/data/generator', function (req,res) {
	var d = new Date("2014-02-18T00:00:00Z");
	for (var i = 86400 ; i >= 0 ; i--) {
		d.setSeconds( d.getSeconds() - 1 );
		
		var sentiment = {
			dateTime : d,
			brand : "mongodb",
			sentiment : "negative",
			"pos_score" : 0 ,
			"neg_score" : Math.random()
		}
		
		sentimentCollection.save( sentiment, function(err){}  );
		
	}
	
	
	res.send( d );
	
	
	
	
});

//get config keyworkds
app.get('/api/config/keywords' , function(req,res) {
	
	configCollection.findOne({ '_id' : 'keywords' }, function(err, document) {
  	  res.send(document);
	});
});




// Routing
require('./lib/routes')(app);


// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;



});
