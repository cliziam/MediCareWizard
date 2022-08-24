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

    $(document).ready(function(){
        sessionNameUser(); /* adjust the welcome step */
    });

    // log-out functionality
    $(".nav-link").on("click", function(){
        sessionStorage.removeItem('email');
        var url = "https://s3.amazonaws.com/medicarewizard1/index.html";
        $(location).attr('href',url);
    });


    // get item values to insert in DynamoDB proper table
    $(".btn-outline-secondary").on("click", function(){

        var name=$(".name").val();
        var surname=$(".surname").val();
        var phonenumber=$(".phonenumber").val();
        var SSN=$(".SSN").val();

        var hour = $(".hour").children("option:selected").val();
        var date = $(".selectDay").children("option:selected").val();
        var exams = $(".exams").children("option:selected").val();

        var data = {
            'email': sessionStorage.getItem('email'),
            'name': name,
            'surname': surname,
            'phonenumber': phonenumber,
            'SSN': SSN,
            'hour': hour,
            'date':date,
            'exams': exams
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
                alert("Reserved an exam");
                location.reload();
            },
            
            error: function () {
                // show an error message
                alert("UnSuccessfull Reservation");
        }});
    }); 

})();

