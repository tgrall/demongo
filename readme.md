# MongoDB Demonstration

This demonstration is used to show some of the key features of MongoDB


## Installation

### MongoDB Database Setup

You should use MongoDB 2.6.x or later. (use Full Text Search : http://docs.mongodb.org/manual/core/index-text/ )

Create indexes in the twitter database, from the mongo shell:

	use twitter

	db.messages.ensureIndex( {'text':'text'})

	db.messages.ensureIndex( {'coordinates.coordinates':'2dsphere'})

	db.messages.ensureIndex( {'id' : 1})

	db.sentiments.ensureIndex( {'brand' : 1}, {dateTime : -1} )


Create a configuration document used by the injector and application. (Screen will come)

	db.config.save({
	"_id" : "keywords",
	"keywords" : [
		{
			"value" : "apple",
			"label" : "Apple"
		},
		{
			"value" : "mongodb",
			"label" : "MongoDB"
		},
		{
			"value" : "amazon",
			"label" : "Amazon"
		},
		{
			"value" : "google",
			"label" : "Google"
		},
		{
			"value" : "ford",
			"label" : "Ford"
		}
	]
	})



TODO: more index to setup

### Python Injector

See Python Project

Do not foret to configure your Twitter API Keys. (see importer.py file )

### Node/AngularJS Application

See Node Project


### To Do
The application is using direct find and aggregate, for scalability reason I am planning to change the implement and use a "prep-aggregated" approach see [here](http://docs.mongodb.org/ecosystem/use-cases/pre-aggregated-reports/)
