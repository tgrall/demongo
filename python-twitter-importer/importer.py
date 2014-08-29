from dateutil import parser
from pymongo import MongoClient
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from senti_classifier import senti_classifier
from array import array
from senti_classifier import senti_classifier
import json


def escapeSpecialCharacters ( text, characters ):
    for character in characters:
        text = text.replace( character, '' )
    text = '"' + text + '"'
    text = text.replace("\n", "")
    return text

def getSentiment ( pos_score, neg_score ):
    if pos_score > neg_score:
        return "positive"
    elif neg_score > pos_score:
        return "negative"
    elif pos_score == neg_score:
        return "neutral"

def convertDateTime(dt):
    return parser.parse(dt)


# Go to http://dev.twitter.com and create an app.
# The consumer key and secret will be generated for you after
consumer_key=   # ENTER YOU CONSUMER KEY
consumer_secret= # ENTER YOUR CONSUMER SECRET

# After the step above, you will be redirected to your app's page.
# Create an access token under the the "Your access token" section
access_token= # ENTER YOUR ACCESS TOKEN
access_token_secret= # ENTER YOU ACCESS TOKEN SECRET

class StdOutListener(StreamListener):
    """ A listener handles tweets are the received from the stream.
    This is a basic listener that just prints received tweets to stdout.

    """
    def on_data(self, data):
        #print data
	tweet = json.loads(data)
        text = escapeSpecialCharacters( tweet['text'], '\'"/\\' )
        pos_score, neg_score = senti_classifier.polarity_scores([text])
        sentiment = getSentiment(pos_score, neg_score)
        dateTime = convertDateTime(tweet['created_at'])
        tweet_id = tweet['id']
        
        # saving the date as "Date"
        tweet['created_at'] = dateTime

        for word in key_words:
            if  text.lower().find(word.lower()) > -1 : 
                doc = {
                    "brand": word.lower(),
                    "pos_score": pos_score,
                    "neg_score": neg_score,
                    "sentiment": sentiment,
                    "dateTime":  dateTime,
                    "twet_id" :  tweet_id}  
                sentimentsColl.insert(doc)
                print tweet_id
        
        
	messagesColl.insert(tweet)
        return True

    def on_error(self, status):
        print status

if __name__ == '__main__':

    client = MongoClient()
    db = client.twitter
    messagesColl = db.messages
    sentimentsColl = db.sentiments
    configColl = db.config

    config = configColl.find_one( {"_id" : "keywords"} )
    key_words = [];
    brands = config["keywords"];
    for brand in brands:
        key_words.append( brand['value']  )
    
    print key_words
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    stream = Stream(auth, l)
    stream.filter(track=key_words, languages=['en'])
        #stream.sample()
