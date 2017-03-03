var jsonSlides;

$(document).ready(function() {
    console.log(jsonData);
    init();
});


/*=============================================
=            Lav navigation og generelle funktioner            =
=============================================*/

function init() {
    jsonSlides = jsonData[0].slides;
    var navHTML = "";
    for (var i = 0; i < jsonSlides.length; i++) {
        navHTML += "<div class='btn btn-info btn-nav'>" + jsonSlides[i].header + "<div class='lockicon'><span class='glyphicons glyphicons-lock'></span></div></div>";
    }

    $(".top_nav_container").html(navHTML);


    $(".glyphicons").eq(0).removeClass("glyphicons-lock").addClass("glyphicons-unlock"); 

    $(".btn-nav").click(function(){
        //var indeks = $(this).index; 
        clicked_nav($(this));
    });
}

/*=====  End of Section comment block  ======*/


function clicked_nav(obj){
    var indeks = obj.index();
    console.log(indeks);

    $(".main_container").html(jsonSlides[indeks].html_content);
}

function hello(){
alert("Hej fra iframe");
};