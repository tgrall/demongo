
##Installation

In yor Python environment, install the various dependencies : sentiment_classifier, pymongo, tweepy, python-dateutil

This project use pip and you can run the following command :

	pip install -r requirements.txt


If not done already, you need to configure the Natural Language Toolkit - NLTK as documented [here](http://www.nltk.org/data.html). I have installed "all packages".


##Enter your Tweeter API keys

Open the importer.py file and add your keys there:


	consumer_key=   # ENTER YOU CONSUMER KEY
	consumer_secret= # ENTER YOUR CONSUMER SECRET
	access_token= # ENTER YOUR ACCESS TOKEN
	access_token_secret= # ENTER YOU ACCESS TOKEN SECRET



##Run the Tweeter Importer

You can now run the Twitter importer:

	python importer.py
