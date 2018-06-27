'use strict';

(function(window, $, CALENDAR_ID, API_KEY) {

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

  var extractDate = function(start) {
    return (start.date) ? start.date : start.dateTime.split('T')[0];
  }

  var updateEventDisplay = function(date, eventsData) {
    $("#evento > .event-date").html(date);
    $("#evento > .event-title").html(eventsData[date].title);
    $("#evento > .event-location").html(eventsData[date].location || '');
    $("#evento > a").attr('href', eventsData[date].link || '');
  }

  var clickHandler = function(id, eventsData) {
    var el = $("#" + id);
    var hasEvent = el.data("hasEvent");
    if (hasEvent) {
      $(".at-event-selected").removeClass("at-event-selected");
      el.addClass('at-event-selected');
      updateEventDisplay(el.data("date"), eventsData);
    }
  }

  var titleText = function(item) {
    var text = item.summary;
    if (item.location) {
      text += ' - ' + item.location;
    }
    return text; 
  }
    
  $(document).ready(function () {
    $.get(eventsUrl(new Date()), function(data) {
      var events = [];
      var eventsData = {};
      var nextDate = 
      data.items.forEach(function(item, i) {
        var date = extractDate(item.start);
        var classname = (i === 0) ? 'at-event at-event-selected' : 'at-event';
        events.push({ 
          date: date,
          title: titleText(item),
          classname: classname
        });
        eventsData[date] = {
          title: item.summary,
          location: item.location,
          link: item.description
        }
        if (i === 0) {
          updateEventDisplay(date, eventsData);
        }
      });
      $(".agenda").removeClass("hidden");
      $("#zabuto-calendar").zabuto_calendar({
        data: events,
        language: "pt",
        weekstartson: 0,
        show_previous: false,
        action: function () {
          return clickHandler(this.id, eventsData);
        },
        nav_icon: {
          prev: '<i class="fa fa-chevron-left"></i>',
          next: '<i class="fa fa-chevron-right"></i>'
        }
      });
    });
  });

})(window, window.jQuery, window.CALENDAR_ID, window.API_KEY);

