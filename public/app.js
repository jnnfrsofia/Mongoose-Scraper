function addArticle(insertDiv, article) {
    if (article == undefined) {
        console.log('Article undefined.');
    }

//Create a bootstrap panel for each article
    var articlePanel = $("<div>").attr({
        // "data-id": article._id,
        "class": "panel panel-default"
    })
    console.log(article._id)

    //Create the required heading div and insert title text
    var headingDiv = $("<div>").attr({
        "class": "panel-heading"
    })

    var title = $("<h3>").attr({
        "data-id": article._id,
        "class": "panel-title"
    })

    title.text(article.title);

    headingDiv.append(title);

    //Create a div for the article link and insert link
    var link = $("<div>").attr({
        "class": "panel-body"
    })

    link.text(article.link);


    //Append the title and link divs to the main panel
    articlePanel.append(headingDiv);
    articlePanel.append(link);
 

    //Add the panel to the DOM
    $(insertDiv).prepend(articlePanel);
}


$(document).ready(function() {

    // Grab the articles as a json
    $.getJSON("/articles", function(data) {
        console.log("get /scrape data: ", data);

    })

})

$("#scrapeBtn").on("click", function() {
    console.log("scrapeBtn")
    $.getJSON('/articles', function(data) {
        console.log(data);

        for (var i = 0; i <= 5; i++) {
            var currentArticle = data[i];

            if (currentArticle == undefined) {
                continue;
            }

            addArticle("#articlesDiv", currentArticle);
          }
    });
});


// Whenever someone clicks add h3 tag
$(document).on("click", "h3", function() {
  console.log("h3 clicked")
    // Empty the comments from the comments section
    $("#commentsDiv").empty();
    // Save the id from the  tag
    var thisId = $(this).attr("data-id");
    // console.log(this);
    // console.log(thisId);

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the comments information to the page
        .done(function(data) {
            console.log(data);
            // The title of the article
            $("#commentsDiv").append("<h3>" + data.title + "</h3>");
            // An input to enter a new title
            $("#commentsDiv").append("<input id='titleinput' name='title' >");
            // A textarea to add a new comment body
            $("#commentsDiv").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new comment, with the id of the article saved to it
            $("#commentsDiv").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            // If there's a comment in the article
            if (data.comments) {
                // Place the title of the comment in the title input
                $("#titleinput").val(data.comments.title);
                // Place the body of the comment in the body textarea
                $("#bodyinput").val(data.comments.body);
            }
        });
});

// When you click the save comment button
$(document).on("click", "#savecomment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#comments").empty();
        });

    // Also, remove the values entered in the input and textarea for comment entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});