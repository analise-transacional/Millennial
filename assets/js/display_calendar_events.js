'use strict';

(function(window, $) {

  var months = {
    '01': 'janeiro',
    '02': 'fevereiro',
    '03': 'março',
    '04': 'abril',
    '05': 'maio',
    '06': 'junho',
    '07': 'julho',
    '08': 'agosto',
    '09': 'setembro',
    '10': 'outubro',
    '11': 'novembro',
    '12': 'dezembro',
  }

  var formatDate = function(date) {
    var dt = date.split('-');
    return parseInt(dt[2], 10)+' de '+months[dt[1]]+', '+dt[0];
  }

  var extractDate = function(start) {
    return (start.date) ? start.date : start.dateTime.split('T')[0];
  }

  var updateEventDisplay = function(date, eventsData) {
    $(".event-date").html(formatDate(date));
    $(".event-title").html(eventsData[date].title);
    $(".event-location").html(eventsData[date].location || '');
    $(".event > a").attr('href', eventsData[date].link || '');
  }

  var handleSelection = function(element, eventsData, selected) {
    var hasEvent = element.data("hasEvent");
    if (hasEvent) {
      var date = element.data("date");
      if (date !== selected.date) {
        selected.date = date;
        updateEventDisplay(date, eventsData);
      }
      $(".at-event-selected").removeClass("at-event-selected");
      element.addClass('at-event-selected');
    }
  }

  var titleText = function(item) {
    var text = item.summary;
    if (item.location) {
      text += ' - ' + item.location;
    }
    return text; 
  }

  var findEventElement = function(date) {
    var idSelector = "td[id$='" + date + "']";
    return $(idSelector);
  }

  var displayCalendar = function(rawEvents) {
    var events = [];
    var eventsData = {};
    var selected = {};
    
    // Map events
    rawEvents.items.forEach(function(item, i) {
      var date = extractDate(item.start);
      events.push({ 
        date: date,
        title: titleText(item),
        classname: 'at-event'
      });
      eventsData[date] = {
        title: item.summary,
        location: item.location,
        link: item.description
      }
    });

    // Display calendar panel instead of loading panel
    $("#agenda-container").removeClass("hidden");
    $("#agenda-loading").addClass("hidden");
    
    // Display calendar
    $("#zabuto-calendar").zabuto_calendar({
      data: events,
      language: "pt",
      weekstartson: 0,
      show_previous: false,
      action: function () {
        var el = $("#" + this.id);
        return handleSelection(el, eventsData, selected);
      },
      action_nav: function () {
        if (selected.date) {
          return setTimeout(function() {
            var el = findEventElement(selected.date);
            if (el.length !== 0) {
              handleSelection(el, eventsData, selected);
            }
          }, 70);
        }
      },
      nav_icon: {
        prev: '<i class="fa fa-chevron-left"></i>',
        next: '<i class="fa fa-chevron-right"></i>'
      }
    });

    // Select first event
    if (rawEvents.items.length > 0){
      var selectedElement = findEventElement(extractDate(rawEvents.items[0].start));
      handleSelection(selectedElement, eventsData, selected);
    }
  }
    
  $(document).ready(function () {
    if (window.rawCalendarEvents) {
      displayCalendar(window.rawCalendarEvents);
    } else {
      window.addEventListener('CALENDAR_EVENTS_LOADED', function (e) {
        displayCalendar(window.rawCalendarEvents);
      }, false);
    }
  });

})(window, window.jQuery);

