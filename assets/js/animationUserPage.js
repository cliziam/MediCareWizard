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
            url : "https://ayz4y6cie2.execute-api.us-east-1.amazonaws.com/Dev/bookingapp",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",

            success: function (e) {
                // clear form and show a success message
                for(var key in e){
                    var row = "<tr>" + 
                                "<th scope='row'>" + e[key].examtype + "</th>" +
                                "<td>" + e[key].hour + "</td>" +
                                "<td>" + e[key].date + "</td>" +
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
            url : "https://ayz4y6cie2.execute-api.us-east-1.amazonaws.com/Dev/reservation",
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
                                    "<td id='examtype'>" + e[key].examtype + "</td>" +
                                    "<td>" + e[key].name + "</td>" +
                                    "<td>" + e[key].surname + "</td>" +
                                    "<td>" + e[key].phonenumber + "</td>" +
                                    "<td>" + e[key].SSN + "</td>" +
                                    "<td>" + e[key].hour + "</td>" +
                                    "<td>" + e[key].date + "</td>" +
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

        var url = "https://s3.amazonaws.com/medicarewizard1/index.html";
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
            url : "https://ayz4y6cie2.execute-api.us-east-1.amazonaws.com/Dev/reservation",
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

        var name=$("#name").val();
        var surname=$("#surname").val();
        var phonenumber=$("#phonenumber").val();
        var SSN=$("#SSN").val();

        var hour = $(".hour").children("option:selected").val();
        var date = $(".selectDay").children("option:selected").val();
        var exams = $(".exams").children("option:selected").val();

        var data = {
            //'email': sessionStorage.getItem('email'),
            'email':'p@gmail.com',
            'name': name,
            'surname': surname,
            'phonenumber': phonenumber,
            'SSN': SSN,
            'hour': hour,
            'date':date,
            'examtype': exams
        };

        $.ajax({
            type: "POST",
            url : "https://ayz4y6cie2.execute-api.us-east-1.amazonaws.com/Dev/reservation",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function () {
                // clear form and show a success message
                alert("Reserved an exam");
                location.reload();
            },

            error: function () {
                // show an error message
                alert("UnSuccessfull Reservation");
        }});
    }); 

})();