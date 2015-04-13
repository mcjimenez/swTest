'use strict';

function debug(str) {
  console.log("CJC APP -*-:" + str);
}

debug('Self: ' + (self?'EXISTS':'DOES NOT EXIST'));

(function() {

  var count = 0;

  if (!('serviceWorker' in navigator)) {
    debug('navigator has not ServiceWorker');
    return;
  }

  var register = function(evt) {
    debug('executing register...');
    navigator.serviceWorker.register('sw.js', {scope: '/swshim/'}
    ).then(function(reg) {
      debug('Registration succeeded. Scope: ' + reg.scope);
      if (reg.installing) {
        debug('registration --> installing');
      } else if (reg.waiting) {
        debug('registration --> waiting');
      } else if (reg.active) {
        debug('registration --> active');
      }
    }).catch(function(error) {
      debug('Registration failed with ' + error);
    });
  };

  var unregister = function(evt) {
    debug('Unregister...');
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      registrations.forEach(function (registration) {
        registration.unregister();
        debug('Unregister done');
      });
    });
  };

  var sendConnectionMessage = function () {
    debug('sendConnectionMessage...');
    navigator.serviceWorker.getRegistrations().then(function(regs) {
      debug('Got regs: ' + JSON.stringify(regs));
      regs.forEach(reg => {
        debug('Got reg: ' + JSON.stringify(reg.active));
        debug('*** creating msg');
        // We must construct a structure here to indicate our sw partner that
        var message = {
          isFromIAC: true,
          isConnectionRequest: true,
          uuid: '12345678-9abc-4def-y012-34567890abcd',
          dataToSend: {
            data: "Hello from the main thread!",
            count: count++
          }
        };
        debug('sending message ' + (reg.active?' reg active':'reg NO active'));
        reg.active && reg.active.postMessage(message);
      });
    });
  };

  window.onmessage = function(evt) {
    debug('Msg recibido en app');
    for (var kk in evt) {
      debug("onMesssage -->:"+kk+":"+JSON.stringify(evt[kk]));
    }
  };

  window.addEventListener('load', function () {
    debug('Document loaded!');
    var regBto = document.querySelector('#regBto');
    var unRegBto = document.querySelector('#unregBto');
    var sendMessageBto = document.querySelector('#sendMsgBto');
    regBto.addEventListener('click', register);
    unRegBto.addEventListener('click', unregister);
    sendMessageBto.addEventListener('click', sendConnectionMessage);
  });

})(self);
