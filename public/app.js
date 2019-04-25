// Global variables for modals
var thisId;
var thisTitle;

// Get news JSON and display
$.getJSON("/news", function(data) {
    console.log(data);
    for(var i = 0; i < data.length; i++) {
        $("#news").append("<p data-id=" + data[i]._id + "><h5>" + data[i].title + "</h5><br/>"
        + data[i].summary + "<br ><a href='"+data[i].URL+"'>" + data[i].URL + 
        "</a></p>");

        // Display previous added notes
        if(data[i].note) {
            for(var j = 0; j < data[i].note.length; j++) {
            $("#news").append("<p class='note'><h5>Note: </h5>"+data[i].note[j].user+": "+data[i].note[j].note+"</p>");
            };
        };

        // Add button to edit notes
        $("#news").append("<button type='button' class='btn btn-danger' data-toggle='modal' data-target='#exampleModal' data-whatever='" + 
        data[i].title + "' data-id='"+ data[i]._id + "'>Create Note</button><br><br>"); 
    };
}) ;

$(document).on("click", ".btn-danger", function(event) {
    event.preventDefault();
    
    thisTitle = $(this).attr("data-whatever");
    thisId = $(this).attr("data-id");
    $("#exampleModalLabel").text(thisTitle);
});

$(document).on("click", "#savenote", function(event) {
    event.preventDefault();

    // Post the new note
    $.ajax({
        method: "POST",
        url: "/news/" + thisId,
        data: {
            // User
            user: $("#user-name").val(),
            // Note
            note: $("#note").val()
        }
    }).then(function(postdata) {
        console.log(postdata);
        $("#user-name").val("");
        $("#note").val("");
        $(".close").click();
    })
});

