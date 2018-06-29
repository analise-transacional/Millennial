'use strict';

(function(window, CALENDAR_ID, API_KEY) {

  var calendarAPI = 'https://www.googleapis.com/calendar/v3';
  var eventsPath = '/calendars/' + CALENDAR_ID + '/events';
  var ordering = '?orderBy=startTime&singleEvents=true'
  var fields = '&fields=items(id,start,summary,location,description)';
  var key = '&key='+ API_KEY;

  var eventsUrl = function(dt) {
    var time = 'T00:00:00-03:00';
    var date = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
    var timeMin = '&timeMin='+date+time;
    return calendarAPI + eventsPath + ordering + timeMin + fields + key;
  }

  var getJSON = function(url, successHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined'
      ? new XMLHttpRequest()
      : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) { // `DONE`
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          successHandler && successHandler(data);
        }
      }
    };
    xhr.send();
  };

  getJSON(eventsUrl(new Date()), function(data) {
    window.rawCalendarEvents = data;
    var event;
    try {
      event = new Event('CALENDAR_EVENTS_LOADED');
    } catch(e) {
      event = document.createEvent('Event');
      event.initEvent('CALENDAR_EVENTS_LOADED', true, true);
    }
    window.dispatchEvent(event);
  });
  
})(window, window.CALENDAR_ID, window.API_KEY);

