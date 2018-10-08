var _ = require('lodash');

var Twitter = require('twitter');

var _internals = {};

_internals.search = function (payload, creds, cb) {
    
    var client = new Twitter({
      consumer_key: creds.consumer_key,
      consumer_secret: creds.consumer_secret,
      access_token_key: creds.access_token_key,
      access_token_secret: creds.access_token_secret
    });
    
    client.get('search/tweets', payload, function(error, tweets, response){
       cb(error, tweets);
    });
};


module.exports = function(RED) {
    'use strict';

    function Node(n) {
      
        RED.nodes.createNode(this,n);

        var node = this;
        

        this.on('input', function (msg) {
            
            var creds = RED.nodes.getNode(n.creds);
            
            var payload = typeof msg.payload === 'object' ? msg.payload : {};

            var attrs = ['q','geocode','lang','result_type','count','until','since_id','max_id','include_entities','tweet_mode'];

            // Check if the field value is msg.* or a normal string/integer
           // var regex = /msg\.[a-zA-Z0-9-_.]+/g;
            var attrVal = '';
            var val = ''
            for (var attr of attrs) {
                    
                // Attempt matching only if the value is not boolean or null
                // as it will fail otherwise
                if (_.isBoolean(n[attr]) === false && _.isNull(n[attr]) === false) {
                    attrVal = n[attr].match(/msg\.[a-zA-Z0-9-_.]+/g);
                }
                
                // Request for full tweets if the user desires
                if(attr == 'tweet_mode') {
                    n[attr] ? payload[attr] = "extended" : '';
                }
                
                // Get the object member if a match is found in a user-provided string
                // `result_type` is ignored as its options are limited 
                else if (attrVal !== null && attr !== 'result_type') {
                    
                    // Evaluates the string to return an object member
                    val = eval(attrVal[0]);

                    // Only accept number or string data types
                    if (_.isNumber(val) || _.isString(val)) {
                        payload[attr] = val;
                    }
                    else {
                        node.warn("Type error: Type of the value for " + attrVal + " must be string or number. " + typeof(val) + " was given instead. Field name: " + attr + ". The value wasn't included in the search string");
                    }
                }

                else {
                    payload[attr] = n[attr];
                }
            }


            _internals.search(payload, creds, function(err, result){
        
                msg.payload = result;
                node.log(err);
                node.log(JSON.stringify(result));
                node.send(msg);
            });
        });
    }

    RED.nodes.registerType('twitter-search', Node);
};
