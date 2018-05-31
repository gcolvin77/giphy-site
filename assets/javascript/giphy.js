$(document).ready(function () {

    var topics = ["Deadpool", "Captain America","Ironman","Black Panther","Spiderman","Thor"];
    var favorites = [];
    var faveCount=0;

    $("#clear").hide();  // hide clear button is default

    function createButtons(){

           $("#buttons").empty();

            var faveBtn = $("<button>");
            faveBtn.addClass("fave");
            faveBtn.text("Favorites");
            $("#buttons").append(faveBtn);

            for (var i=0; i<topics.length; i++)  {
              var newButton= $("<button>");
              newButton.addClass("btn");
              newButton.attr("data-name", topics[i]);
              newButton.text(topics[i]);
              $("#buttons").append(newButton);                

         }  
      }//end create button function

      $("#add-hero-button").on("click", function(event) {

        $("#clear").hide();
        
        event.preventDefault();        

        if ($("#hero-input").val().length > 0){   //check text field is not empty
        
        var newTopic = $("#hero-input").val().trim();
        topics.push(newTopic);
        createButtons();
        $("#hero-input").val("");  //reset text field

        }
      });

      $(document).on("click", ".btn", function(){

            $("#clear").hide();
            $("#giphy-results").empty(); //dump previous gifs
            
            var selection = $(this).attr("data-name");   //search name is attached to button clicked
            var maxRating = $("select").val();             // rating is attached to what they select

            var giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=4lhCBZvEia61a3iKxe9Bg7Ejsy2cz7I0&q=" + 
                selection + "&limit=10&offset=0&rating=" + maxRating + "&lang=en";
        
        $.ajax({
            url: giphyURL,
            method: "GET"
        })
        .then(function(response) {
            
            var results = response.data;
            console.log(results);
            for (var i=0; i<results.length; i++) {

                var gifDisplay = $("<div>");
                gifDisplay.addClass("gifBox");
                gifDisplay.data("gif", results[i]);
                
                var rating = results[i].rating;
                var p = $("<p>").text("Rating: " + rating.toUpperCase());
                var link = $("<a>");
                link.attr("href", results[i].url);
                link.attr("download", "");
                link.text("Download Gif");
                  
                var marvelGIF = $("<img>");
                marvelGIF.addClass("gif");
                marvelGIF.attr("src", results[i].images.fixed_height_still.url); 
                marvelGIF.attr("data-state", "still");
                marvelGIF.attr("data-still", results[i].images.fixed_height_still.url);    
                marvelGIF.attr("data-animated", results[i].images.fixed_height.url);
                
                gifDisplay.append(marvelGIF);
                gifDisplay.append(p);
                gifDisplay.append(link);
                gifDisplay.append()

                $("#giphy-results").append(gifDisplay);

            }  //end for loop            
            
        })  //end .then

      })  //end click button function

      $(document).on("click", ".gif", function(){
        
        if ($(this).attr("data-state") == "still") {

            $(this).attr("src", $(this).attr("data-animated"));
            $(this).attr("data-state", "animated")
        } 
        else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still")
        }

      }); //end click gif function

      $(document).on("dblclick", ".gifBox", function(){


          if ($(this).data("faveStatus") != "favorite") {

             $(this).addClass("favorite");
             $(this).data("faveStatus", "favorite");
             $(this).data("faveNumber", faveCount);
             favorites.push($(this).data("gif"));
             localStorage.setItem("array", JSON.stringify(favorites));
             faveCount++; 
          }

          else{
            $(this).removeClass("favorite");
            $(this).removeData("faveStatus");
            favorites.splice(faveCount, 1);
            localStorage.clear(); 
            localStorage.setItem("array", JSON.stringify(favorites));           

          }



    }); //end add/remove faves click function


    $(document).on("click", ".fave", function(){     //show favorites
        $("#giphy-results").empty();
        $("#clear").show();

        favorites = JSON.parse(localStorage.getItem("array"));

         if(favorites != null && favorites.length>0)  {

         for (var i=0; i<favorites.length; i++) {

            var gifDisplay = $("<div>");
            gifDisplay.addClass("gifBox");            
            
            var rating = favorites[i].rating;
            var p = $("<p>").text("Rating: " + rating.toUpperCase()); 

            var link = $("<a>");
            link.attr("href", favorites[i].url);
            link.attr("download", "marvelgif");
            link.text("Download Gif");

            var marvelGIF = $("<img>");
            marvelGIF.addClass("gif");
            marvelGIF.attr("src", favorites[i].images.fixed_height_still.url); 
            marvelGIF.attr("data-state", "still");
            marvelGIF.attr("data-still", favorites[i].images.fixed_height_still.url);    
            marvelGIF.attr("data-animated", favorites[i].images.fixed_height.url);
            
            gifDisplay.append(marvelGIF);
            gifDisplay.append(p);

            $("#giphy-results").append(gifDisplay);

          }  //end for loop  
        } //end if statement (checks to see favorites have been added)
    });  // end show favorites

    $(document).on("click", "#clear", function(){
            localStorage.clear();
            $("#giphy-results").empty();
            $("#clear").hide();
    });

    createButtons();

});//document ready function