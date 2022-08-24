(function(){
    
    function sessionNameUser(){ /* Return the Session Name User*/
        if(sessionStorage.getItem('email')){
            $('.mainMenu > .mb-3').append("Welcome " + sessionStorage.getItem('email'));
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
                                "<th scope='row'>" + e[key].name + "</th>" +
                                "<td>" + e[key].surname + "</td>" +
                                "<td>" + e[key].phonenumber + "</td>" +
                              "</tr>"; 

                    $(".mainMenu > .table > tbody").append(row);  
                }
                
            },
            
            error: function () {
                // show an error message
                alert("UnSuccessfull Loading Reservations");
        }});
    }
     
    
    
    $(document).ready(function(){
        sessionNameUser(); /* adjust the welcome step */
        updateAvailableReservations(); /* Updating the reservation menu for userPage */
        //showReservationsBooked(); /* Show all reservations by a particular user */
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
        var inTime = $(".hour").children("option:selected").val();
        var date = $(".selectDay").children("option:selected").val();
        var name = $(".name").val();
        var surname = $(".surname").val();
        var phonenumber = $(".phonenumber").val();

        var data = {
            'email': sessionStorage.getItem('email'),
            'hour': inTime,
            'date': date,
            'name':name,
            'surname': surname
            'phonenumber': phonenumber
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
                alert("Reserved a seat");
                location.reload();
            },
            
            error: function () {
                // show an error message
                alert("UnSuccessfull Reservation");
        }});
    }); 

})();