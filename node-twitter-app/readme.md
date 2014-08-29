# Installation

The Web application is based on a complete JavaScript stack:

* Node.js
	* Express for the REST layer
	* MongoClient 
* AngularJS
	* with many Directives
	

## Prerequisite
To be able to run this demonstration you need to have all the Javscript tools installed:


1. Git ...
2. [Node.js](http://nodejs.org/) 
3. [Yoeman](http://yeoman.io/) that will install Yo, Bower and Grunt
4. [Grunt CLI](https://github.com/gruntjs/grunt-cli)

One you have done that you should be able to run the following command from your shell:

	yo --version
	
	node --version
	
	npm --version
	
	grunt --version 
	
	bower --version

You are not ready to build and run the application

## Installation



### Application Setup

Clone the repository and go the the node application directory

	git clone https://github.com/tgrall/demongo.git
	
	cd ./demongo/node-twitter-app


Install the Bower dependencies (all client side dependencies including AngularJS directives)

	bower install --force

Install the node.js (NPM) dependencies such as Express, and MongoClient

	npm install


You are now all set to run the application:

	grunt serve


Your browser will open automatically to the homepage of the application, if not go to [http://localhost:9000](http://localhost:9000)






Database

- start with Full Text Support

- Create twitter db

- Create Indexes for Search and Geo
db.messages.ensureIndex( {'text':'text'})
db.messages.ensureIndex( {'coordinates.coordinates':'2d'})


