$(document).ready(function() {
  // API for getting all trips
  var allTripsUrl = 'https://trektravel.herokuapp.com/trips';

  var hideTripDetails = function(tripEl) {
    tripEl.children('.trip_detail').remove();
  };

  var hasTripDetails = function(tripEl) {
    return tripEl.children('.trip_detail').length > 0;
  };

  var toggleTripDetails = function(tripEl, tripID) {
    if (hasTripDetails(tripEl)) {
      hideTripDetails(tripEl);
    } else {
      showTripDetails(tripEl, tripID);
    }
  };

  var showTripDetails = function(tripEl, tripID) {
    var tripDetailUrl = allTripsUrl + '/' + tripID;

    var detailsEl = $('<div>', {
      class: 'trip_detail',
    });

    tripEl.append(detailsEl);

    $.get(tripDetailUrl, function(trip) {
      $('<p>', {
        text: "ID: " + tripID,
      }).appendTo(detailsEl);

      $('<p>', {
        text: trip.name,
      }).appendTo(detailsEl);

      $('<p>', {
        text: trip.continent,
      }).appendTo(detailsEl);

      $('<p>', {
        text: trip.about,
      }).appendTo(detailsEl);

      $('<p>', {
        text: "category: " + trip.category,
      }).appendTo(detailsEl);

      $('<p>', {
        text: "weeks: " + trip.weeks,
      }).appendTo(detailsEl);

      $('<p>', {
        text: "cost: " + trip.cost,
      }).appendTo(detailsEl);

      $('<button>', {
        text: "Reserve a spot",
        class: "button",
        click: function() {
          showReserveForm(tripID, detailsEl);
          return false;
        }
      }).appendTo(detailsEl);

      detailsEl.fadeIn(500);
    }).always(function(){
      // not used yet
    }).fail(function(){
      $('<p>', {
        text: "failed to load trip details :(, try again...",
      }).appendTo(detailsEl);
    });
  };

  var showReserveForm = function(tripID, tripDetailsEl) {
    tripDetailsEl.children('.reserve_form_div').remove();

    var reserveDivEl = $('<div>', {
      id: "reserveTripFormDiv",
      class: "reserve_form_div",
    });

    var reserveFormEl = $('<form>', {
      class: "reserve_form",
      id: 'reserveTripForm',
      method: "POST",
      html: '' +
        '<label for="reserveName">Name</label>' +
        '<input type="text" id="reserveName" name="name" value="" />' +
        '<label for="reserveAge">Age</label>' +
        '<input type="text" id="reserveAge" name="age" value="" />' +
        '<label for="reserveEmail">Email</label>' +
        '<input type="text" id="reserveEmail" name="email" value="" />'
    });

    reserveDivEl.append(reserveFormEl);

    $('<button>', {
      text: 'Reserve Your Spot!',
      class: 'button',
      click: function() {
        var name = reserveFormEl.children('#reserveName').val();
        var age = reserveFormEl.children('#reserveAge').val();
        var email = reserveFormEl.children('#reserveEmail').val();
        $.ajax({
          type: 'POST',
          url: 'https://trektravel.herokuapp.com/trips/' + tripID + '/reserve',
          data: {
            name: name,
            age: age,
            email: email,
          },
          success: function(data, textStatus) {
            console.log('success', data)
            alert('Your spot has been reserved!');
          },
          dataType: 'html'
        });
        return false;
      }
    }).appendTo(reserveDivEl);

    tripDetailsEl.append(reserveDivEl);
  };

  var tripsCallback = function (trips) {
    trips.forEach(function(tripData) {
      var tripID = tripData.id;
      var tripName = tripData.name;
      var tripContinent = tripData.continent;

      var tripEl = $("<div></div>");

      $('<a>',{
          text: tripName,
          title: tripName,
          href: "#",
          click: function() {
            toggleTripDetails(tripEl, tripID);
            return false;
          }
      }).appendTo(tripEl);

      // we hide the API url from user (href field) to avoid
      // user open the link in new tab and seeing raw data
      //"<h3><a href=" + url + "/" + response[i].id + ">" + response[i].name + "</a></h3>"

      $('#trips').append(tripEl);
    });
  }

  $('#load').on('click', function() {
    $.get(allTripsUrl, tripsCallback);
  });

/*
  $('#trips').on('click', 'a', function(e){
    e.preventDefault();

    $('#profile').show();

    var tripUrl = $(this).attr('href');

    $.get(tripUrl, function(trip){
      $('#name').text(trip.name);
      $('#continent').text(trip.continent);
      $('#week').text(trip.weeks);
    }).always(function(){
      $("#message").text("Something happened");
    }).fail(function(){
      alert("Failed.");
    });

  });
*/

});
