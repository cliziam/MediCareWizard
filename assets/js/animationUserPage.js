(function(){
    
    function sessionNameUser(){ /* Return the Session Name User*/
        alert(sessionStorage.getItem('email'));
        if(sessionStorage.getItem('email')){
            $('#welcome').append("Welcome " + sessionStorage.getItem('email'));
        } else {
            $('#welcome' ).append('Should log-in...');
        }
    }

    $(".selectDay").one("click", function(){
        var day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let today = new Date()
        var dt = new Date(today);
        var increase_per_day = 0;
        if($(".selectDay").children().length > 0 && $(".selectDay").children().length < day.length){
            let oggi = dt.getDay()
            for(var i = dt.getDay()-1; i < oggi+2 ; i++){
                    increase_per_day = ((i == dt.getDay()-1) ? 0 : 1);
                    dt.setDate(dt.getDate() +increase_per_day);
                    let futureDays = String(dt).slice(0,15);
                    if(futureDays.substring(0,3)!="Sun"){
                        $(".selectDay").append("<option value='" + futureDays + "'>" + futureDays + "</option>");
                    }
            }     
        }
        
    });

    function updateAvailableReservations(){ /* Updating the reservation menu for userPage */
        $.ajax({
            type: "GET",
            url : "https://0gxl3mmkvb.execute-api.us-east-1.amazonaws.com/Dev/bookingapp",
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
            url : "https://0gxl3mmkvb.execute-api.us-east-1.amazonaws.com/Dev/reservation",
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
                                    "<td id='hour'>" + e[key].hour + "</td>" +
                                    "<td id='date'>" + e[key].date + "</td>" +
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

        var url = "https://s3.amazonaws.com/medicarewizard2/index.html";
        $(location).attr('href',url);
    });

    // remove seat
    $(".ReservationBooked").on("click", "#removeSeat", function(){
        var codeReservation = $(this).closest('tbody > tr').find("#codReservation").html();
        var examtype = $(this).closest('tbody > tr').find("#examtype").html();
        var date = $(this).closest('tbody > tr').find("#date").html();
        var hour = $(this).closest('tbody > tr').find("#hour").html();
        var cod_booking = examtype+" "+date+" "+hour;

        var data = {
            'codeReservation': codeReservation,
            'cod_booking':cod_booking
        }

        $.ajax({
            type: "POST",
            url : "https://0gxl3mmkvb.execute-api.us-east-1.amazonaws.com/Dev/reservation",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function () {
                // clear form and show a success message
                alert("Exam Removed");
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
        var cod_booking = exams+" "+date+" "+hour;

        var data = {
            'email': sessionStorage.getItem('email'),
            'name': name,
            'surname': surname,
            'phonenumber': phonenumber,
            'SSN': SSN,
            'hour': hour,
            'date':date,
            'examtype': exams,
            'cod_booking':cod_booking
        };

        $.ajax({
            type: "POST",
            url : "https://0gxl3mmkvb.execute-api.us-east-1.amazonaws.com/Dev/reservation",
            dataType: "json",
            crossDomain: "true",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),

            success: function () {
                // clear form and show a success message
                alert (cod_booking)//("Reserved an exam");
                console.log(cod_booking)
                location.reload();
            },

            error: function () {
                // show an error message
                alert("UnSuccessfull Reservation");
        }});
    }); 

})();