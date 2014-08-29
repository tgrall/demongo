'use strict';


var twitter = require('ntwitter'),
	sentiment = require('sentiment'),
	_ = require('underscore'),
	MongoClient = require('mongodb').MongoClient;
	
var twit = new twitter({
    consumer_key: 'e5A7bXNe0K5rWwr9GUSZIA',
    consumer_secret: 'd7ru6sWIjMMT5jHWLDdp99lzTOWsCq92Ul4qOYX0tZY',
    access_token_key: '14338755-7dnwpBGXaY9wfXe1ZN62Jl1h1dvHeAFSusUxxXSZc',
    access_token_secret: 'Jmf0DJADIZ9iwbX0X5WzHWBLiZ7mBYzgfxRfWHAcI'
});


function getSentiment(score) {
	var sentiment = 'neutral';
	if (score < 0) {
		sentiment = 'negative'
	} else if (score > 0) {
		sentiment = 'positive';
	}
	return sentiment;
}


MongoClient.connect("mongodb://localhost:27017/twitter", function(err, db) {
	if(err) { return console.dir(err); }

	var messagesCollection = db.collection('messages');
	var sentimentCollection = db.collection('sentiments');


	var keywords = ['mongodb', 'amazon', 'apple', 'oracle']


	twit.stream('statuses/filter', {track:keywords}, function(stream) {
		stream.on('data', function (data) {
			data._id = "tw:"+ data.id;
			var text = data.text.toLowerCase();
			
			
			// if text is in English analyze the sentiment and save
			if (data.lang === 'en') {
				_.each(keywords, function(v) {
					if (text.indexOf(v.toLowerCase()) !== -1) {
						sentiment(data.text, function (err, result) {
							console.log( result.score + " -- "+ data.text )
							var sentiment = {
								keyword : v,
								id : data.id,
								created_at : new Date(data.created_at),
								score : result.score,
								sentiment : getSentiment(result.score) 
							}
							sentimentCollection.insert(sentiment, {safe: true}, function(err, records){
							});

							messagesCollection.insert(data, {safe: true}, function(err, records){
							});

						});
					}
			    });
			 }


			
			
			


		});
		stream.on('end', function (response) {
			// Handle a disconnection
		});
		stream.on('destroy', function (response) {
			// Handle a 'silent' disconnection from Twitter, no end/error event fired
		});
		// Disconnect stream after five seconds
		// setTimeout(stream.destroy, 5000);
	});

});