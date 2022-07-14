(function(){
    
    function sessionNameUser(){ /* Return the Session Name User*/
        if(sessionStorage.getItem('email')){
            $('.mainMenu > .mb-3').append("Welcome " + sessionStorage.getItem('email'));
        } else {
            $('.mainMenu > .mb-3').append('Should log-in...');
        }
    }

    $(".selectDay").on("click", function(){
        var day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let today = new Date()
        var dt = new Date(today);
        var increase_per_day = 0;
        if($(".selectDay").children().length > 0 && $(".selectDay").children().length < day.length){
            for(var i = dt.getDay()-1; i < day.length; i++){
                increase_per_day = ((i == dt.getDay()-1) ? 0 : 1);
                dt.setDate(dt.getDate() + increase_per_day);
                let futureDays = String(dt).slice(0,15);
                $(".selectDay").append("<option value='" + futureDays + "'>" + futureDays + "</option>");
            }    
        }
    });

    function updateAvailableReservations(){ /* Updating the reservation menu for userPage */
        $.ajax({
            type: "GET",
            url : "https://mrptcqlxba.execute-api.us-east-1.amazonaws.com/Dev/bookingseats",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",

            success: function (e) {
                // clear form and show a success message
                for(var key in e){
                    var row = "<tr>" + 
                                "<th scope='row'>" + e[key].course + "</th>" +
                                "<td>" + e[key].building + "</td>" +
                                "<td>" + e[key].room + "</td>" +
                                "<td>" + e[key].typeReservation + "</td>" +
                                "<td>" + e[key].seatsAvailable + "</td>" +
                              "</tr>"; 

                    $(".mainMenu > .table > tbody").append(row);  
                }
                
            },
            
            error: function () {
                // show an error message
                alert("UnSuccessfull Loading Reservations");
        }});
    }

    function showReservationsBooked(){ /* Show all reservations by a particular user */
        var data = {
            email: sessionStorage.getItem('email')
        }
        
        $.ajax({
            type: "POST",
            url : "https://mrptcqlxba.execute-api.us-east-1.amazonaws.com/Dev/reservations",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function (e) {
                // clear form and show a success message                
                if(e != "user doesn't book anything"){
                    for(var key in e){
                        var row = "<tr>" + 
                                    "<th scope='row' id='codReservation'>" + e[key].codReservation + "</th>" +
                                    "<td>" + e[key].email + "</td>" +
                                    "<td id='course'>" + e[key].course + "</td>" +
                                    "<td>" + e[key].room + "</td>" +
                                    "<td>" + e[key].building + "</td>" +
                                    "<td>" + e[key].date + "</td>" +
                                    "<td>" + e[key].time + "</td>" +
                                    "<td><a href='#' id='removeSeat'>Dismiss</a></td>" +
                                  "</tr>"; 
    
                        $(".Booked > .table > tbody").append(row);  
                    }
                } else {
                    var row = "<tr>" + 
                                "<th scope='row' colspan='8' style='text-align:center'>No Booked Seat</th>" +
                              "</tr>"; 

                    $(".Booked > .table > tbody").append(row);  
                }
                
            },
            
            error: function () {
                // show an error message
                alert("UnSuccessfull Loading Reservation Booked");
        }});
    }

    $(document).ready(function(){
        sessionNameUser(); /* adjust the welcome step */
        updateAvailableReservations(); /* Updating the reservation menu for userPage */
        showReservationsBooked(); /* Show all reservations by a particular user */
    });

    // log-out functionality
    $(".nav-link").on("click", function(){
        sessionStorage.removeItem('email');

        var url = "https://s3.amazonaws.com/prodigit2.0/index.html";
        $(location).attr('href',url);
    });

    // remove seat
    $(".ReservationBooked").on("click", "#removeSeat", function(){
        var codeReservation = $(this).closest('tbody > tr').find("#codReservation").html();
        var course = $(this).closest('tbody > tr').find("#course").html();

        var data = {
            'codeReservation': codeReservation,
            'course': course
        }

        $.ajax({
            type: "POST",
            url : "https://mrptcqlxba.execute-api.us-east-1.amazonaws.com/Dev/reservations",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function () {
                // clear form and show a success message
                alert("Seat Removed");
                location.reload();
            },
            
            error: function () {
                // show an error message
                alert("UnSuccessfull Remove");
        }});
    });

    // get item values to insert in DynamoDB proper table
    $(".btn-outline-secondary").on("click", function(){
        var inTime = $(".inTime").children("option:selected").val();
        var outTime = $(".outTime").children("option:selected").val();
        var date = $(".selectDay").children("option:selected").val();
        var course = $(".form-control").val();

        var data = {
            'email': sessionStorage.getItem('email'),
            'inTime': inTime,
            'outTime': outTime,
            'course': course,
            'date': date
        };

        $.ajax({
            type: "POST",
            url : "https://mrptcqlxba.execute-api.us-east-1.amazonaws.com/Dev/reservations",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function () {
                // clear form and show a success message
                alert("Reserved a seat");
                location.reload();
            },
            
            error: function () {
                // show an error message
                alert("UnSuccessfull Reservation");
        }});
    }); 

})();