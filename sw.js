'use strict';

function debug(str) {
  console.log("CJC sw.js -*- -->" + str);
}

this.addEventListener('install', function(evt) {
  debug('Install event');
  debug("importScripts executed (hopefully)!");

});

this.addEventListener('activate', function(evt) {
  debug('activate event');
});

this.addEventListener('fetch', function(evt) {
  debug('fetch event');
});

this.onconnect = function(msg) {
  debug("onconnect event");
  debug("onconnect: We should have a port here on msg.source: " + msg.source);
  // msg.source should have the endpoint to send and receive messages, so we can do:
  msg.acceptConnection(true);
  msg.source.onmessage = function(msg) {
    debug("Got a message from one of the accepted connections!");
  };
}

this.oncrossoriginmessage = function(msg) {
  // msg.source is always a client previously accepted by onconnect.
  debug('oncrossoriginmessage Event');
/*
  if (msg.data.type == 'foo') {
    msg.source.postMessage({type: 'reply', payload: 'bar'});
    return;
  }
  msg.source.postMessage({type: 'error', payload: 'Invalid message'});
*/
};


//this.addEventListener('message', function(evt) {
onmessage = function(evt) {
for (var i in evt){
debug('sw '+i+":"+JSON.stringify(evt[i]));
}
  debug('sw got a message: data:' + JSON.stringify(evt.data));
  self.clients.matchAll({includeUncontrolled: true}).then(function(res) {
    if (!res.length) {
      debug("ERROR: no clients are currently controlled.\n");
    }
    res[0].postMessage(evt.data);
  });
};
//});
