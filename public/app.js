// Global variables for modals
var thisId;
var thisTitle;

// Get news JSON and display
$.getJSON("/news", function(data) {
    console.log(data);
    for(var i = 0; i < data.length; i++) {
        $("#news").append("<p data-id=" + data[i]._id + "><h5>" + data[i].title + "</h5><br/>"
        + data[i].summary + "<br /><a href='"+data[i].URL+"'>" + data[i].URL + 
        "</a></p><br/><button type='button' class='btn btn-danger' data-toggle='modal' data-target='#exampleModal' data-whatever='" + 
        data[i].title + "' data-id='"+ data[i]._id + "'>Create Note</button>"); 
    };
}) ;

$(document).on("click", ".btn-danger", function(event) {
    event.preventDefault();
    thisTitle = $(this).attr("data-whatever");
    thisId = $(this).attr("data-id");
    $("#exampleModalLabel").text(thisTitle);
    console.log(thisTitle+"\n"+thisId);
});

$(document).on("click", "#savenote", function(event) {
    event.preventDefault();

    var note = $("#note").val();
    console.log(note);

    // Post the new note
    $.ajax({
        method: "POST",
        url: "/news/" + thisId,
        data: {
            // User
            user: $("#user").val(),
            // Note
            note: $("#note").val(),
        }
    }).then(function(data) {
        console.log(data);
        $(".close").click();
    })
});