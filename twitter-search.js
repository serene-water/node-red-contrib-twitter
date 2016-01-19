var Twitter = require('twitter');

var _internals = {};

_internals.search = function (payload, creds, cb) {
    
    var client = new Twitter({
      consumer_key: creds.consumer_key,
      consumer_secret: creds.consumer_secret,
      access_token_key: creds.access_token_key,
      access_token_secret: creds.access_token_secret,
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
        
            var attrs = ['q','geocode','lang','result_type','count','until','since_id','max_id','include_entities'];
            for (var attr of attrs) {
                if (n[attr]) {
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
