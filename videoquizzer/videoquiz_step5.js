var runde = 0;
var events_taeller = 0;
var total_score = 0;
var total_spm = 0;
var playing = false;
var player;
var playtime;
var xmlData;
var stops;

var videoId;
var popudwidth;
var popud_left;
var total_spille_tid;


var akt_runde;
var spm;
var spm_length;
var tekst;
var bol;
var svar_length;
var svar;

var m = 0;

var checkTimer;
var minutes = 60;
var seconds;

var timestamp_Array = [];
var JsonObj;
var JsonVideoInput_update;
//XML SKAL SKIFTES UD MED JSON

var intro_header;
var intro_knap;
var intro_text;

var studentanswer;



//Indhold kun til den 'rene' player: 

function loadData(url) {
    console.log("loadData");
    //parent.hello();


    $.ajax({
        url: url,
        // contentType: "application/json; charset=utf-8",  // Blot en test af tegnsaettet....
        // dataType: 'json', // <------ VIGTIGT: Saadan boer en angivelse til en JSON-fil vaere! 
        dataType: 'text', // <------ VIGTIGT: Pga. ???, saa bliver vi noedt til at angive JSON som text. 
        async: false, // <------ VIGTIGT: Sikring af at JSON hentes i den rigtige raekkefoelge (ikke asynkront). 
        success: function(data, textStatus, jqXHR) {


            JsonObj = jQuery.parseJSON(data);

            for (var key in JsonObj) {
                var objkey = Object.keys(JsonObj[key]);
                //console.log("objkey:" + objkey);
                if (objkey == "stops") {
                    console.log("bingo: " + objkey);
                    stops = JsonObj[key].stops;
                    //console.log(stops[0].timestamp);
                } else if (objkey == "video") {
                    videoId = JsonObj[key].video;
                } else if (objkey == "intro_header") {
                    intro_header = JsonObj[key].intro_header;
                } else if (objkey == "intro_knap") {
                    intro_knap = JsonObj[key].intro_knap;
                } else if (objkey == "intro_text") {
                    intro_text = JsonObj[key].intro_text;
                }
                //console.log("Stops: " + stops);
            }
            //total_spille_tid = data.find('video').attr('total_tid');
            var lengde = stops.length; //data.find('runde').length;
            //popudwidth = 450;
            //popud_left = 0; //(bredde / 2) - (popudwidth / 2);

            for (var i = 0; i < lengde; i++) {
                timestamp_Array.push(stops[i].timestamp); //data.find('runde').eq(i).attr('timestamp'));
            }

            setUpTube();

            //console.log (Stops[key].timestamp);
            //console.log ("svarlenght:" + Stops[key].svar.length);
            // console.log("Key : " + Key + ", overskrift_Array : " + overskrift_Array[Key] ); 
            // console.log("JsonObj : " + JSON.stringify(JsonObj)  ); 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!!!\njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
        }
    });

}



/// PLAYER SCRIPT - SETUP tube
function setUpTube() {
    console.log("set up Tube");
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onYouTubeIframeAPIReady() {
    setupplayer();
    console.log("onYouTubeIframeAPIReady");
        $(".video-container").css("padding-top", "0px");
}


function setupplayer() {
    console.log("SET UP PLAYER");
    $("#overlay").toggle();
    player = new YT.Player('player', {
        videoId: videoId,
        playerVars: {
            'id': 'ytPlayer',
            'enablejsapi': 1,
            'allowScriptAccess': 'always',
            'mediaPlaybackRequiresUserAction': false,
            'version': 3,
            'controls': 1,
            'showinfo': 0,
            'modestbranding': 1,
            'html5': 1,
            'playsinline': 1,
            'rel': 0,
            'autoplay': false,
            wmode: 'transparent',
            allowFullScreen: false

        },
        events: {
            'onStateChange': function(event) {

                if (event.data == YT.PlayerState.PLAYING) {
                    playing = true;
                } else {
                    playing = false;
                }
            },

            'onReady': function(event) {

                introscreen();

                minutes = Math.floor(player.getDuration() / 60);
                seconds = Math.floor(player.getDuration() - minutes * 60);

                total_spille_tid = minutes + ":" + seconds;


                // VI Tjekker hver 200 ms om videoen skal stoppes..: 
                console.log("on ready");
                checkTimer = setInterval(timerCheck, 200);


            }
        }
    });
    $(".popud").css("width", popudwidth);
    $(".popud").css("left", popud_left);
}



/// Herunder er scriptet identisk med vid_new_web.js

function timerCheck() {
    if (playing == true) {
        $(".ipad").hide();
    }

    var playTime = Math.round(player.getCurrentTime());

    //Gør overlay og timebar responsive:
    var embed_height = $(".embed-responsive").css("height");
    //console.log("embed_height: " + embed_height);
    $("#overlay").css("height", embed_height); //                    $("#time_bar").css("width", player.getCurrentTime() * 10 + "px");
    $("#time_bar").css("width", (player.getCurrentTime() / player.getDuration()) * $(".embed-responsive-16by9").width());

    //Udregn minutter og sekunder til timebar:
    var s = playTime - (m * 60);
    if (s > 59) {
        m++;
    }

    var dec_s = s;
    if (dec_s < 10) {
        dec_s = "0" + dec_s;
    }

    var timestamp_num = parseInt(timestamp_Array[runde]);

    var tid_min_sek = timestamp_num - playTime;

    var tid_sek = tid_min_sek % 60;

    if (tid_sek < 10) {
        tid_sek = tid_sek.toString();
        tid_sek = "0" + tid_sek;
    }

    var tid_min = Math.floor(tid_min_sek / 60);
    if (playing === true) {
        if (runde >= stops.length) {

            $('#time').html(m + ":" + dec_s + "<span style ='color:#bbb'>/" + total_spille_tid + "  </span>");
        } else {
            $('#time').html(m + ":" + dec_s + "<span style ='color:#bbb'>/" + total_spille_tid + "  </span>(Næste spørgsmål om: " + tid_min + ":" + tid_sek + ")");
        }
    } else {
        $('#time').html("Video på pause");
    }

    //console.log(playTime + "," + timestamp_Array[runde] + ", " + player.getPlaybackRate());
    if (playTime >= timestamp_num && playing === true) {
        clearInterval(checkTimer);
        playing = false;
        player.pauseVideo();
        stop_event(runde, 0);
    }
}

// 4. The API will call this function when the video player is ready.

function resumeVideo() {
    //player.seekTo(20);
    player.playVideo();
    checkTimer = setInterval(timerCheck, 200);
}

function introscreen() {
    player.pauseVideo();

    $("#overlay").fadeIn(1000);
    $("#overlay").append("<div class='intro'><div class='h2'>" + intro_header + "</div><p class='h4 feed_txt'>" + intro_text + "</p><div class='btn btn-primary btn-lg introknap'>" + intro_knap + "</div></div>");
    $("#overlay").click(function() {

        $(this).fadeOut(1000, function() {
            $(".intro").remove();
            $("#overlay").unbind();
        });

        if (navigator.platform.indexOf("iPad") != -1 || navigator.platform.indexOf("iPhone") != -1) {
            showIosOverlay();
        } else {
            resumeVideo();
        }
    });
}


function stop_event(tal, taeller) {

    var chosen = false;

    //console.log("HEJ FRA: stop_event");

    //Hvis det er første event --> fade overlay ind..!

    if (events_taeller === 0) {
        $("#overlay").fadeIn();
    }

    //opdater variabler for stop_event..
    akt_runde = stops[tal];
    spm = akt_runde.events[taeller];
    spm_length = akt_runde.events.length;
    tekst = spm.tekst;
    bol = spm.korrekt;
    svar_length = spm.svar.length;
    svar = spm.svar;

    //alert ("akt_runde: " + runde + ", Stops: " + stops.length);
    console.log("runde: "  +runde + ", stops: " + stops.length)



    if (runde >= stops.length-1) {
var opgavenummer = parent.document.location.href.substring(parent.document.location.href.length-6, parent.document.location.href.length-5);

    console.log("padas: " + opgavenummer);


        if (opgavenummer == 1) { parent.slide_complete(7); } else if ( opgavenummer == 2) { parent.slide_complete(6); }


    }


    /////
    var options_text = "";

    //GENERER SVAR MULIGHEDER --> TWEAK IFT Hvilken type det skal være: 

    var eventtype;

    for (var i = 0; i < svar_length; i++) {

        options_text = options_text + "<div id ='" + i + "' class='btn svar_btn btn-info'>" + svar[i] + "</div>";
        //$(".btn_videre").fadeIn().click(feed);

        /*=====  End of insert nav_stop here:  ======*/

    }



    var HTML = "<h5 class='score'></h5>";
    HTML += "<div class='container_tekst'><div class='h3 spm_tekst'>" + tekst + "</h3>";
    HTML += "<div class ='svarcontainer'>" + options_text + "</div></div></div>";
    $(".popud").html(HTML);

    //$(".btn_videre").hide();

    if (spm.eventtype == "show_stop") {
        $(".svar_btn").eq(0).hide();
        $(".svar_btn").eq(1).hide();
    }

    if (spm.eventtype == "nav_stop") {
        var HTML = "<h5 class='score'></h5>";
        HTML += "<div class='container_tekst'><div class='h3 spm_tekst'>" + tekst + "</h3>";
        HTML += "<div class ='svarcontainer'>" + options_text + "</div></div></div>";
        $(".popud").html(HTML);

        $(".svar_btn").click(function() {

            var indeks = $(this).index();

            if (indeks == 0) {
                player.playVideo();
                $("#overlay").fadeOut();
                runde++;

            } else {
                console.log("nav to: " + akt_runde.events[0].timestamps[indeks - 1]);

                player.seekTo(akt_runde.events[0].timestamps[indeks - 1]);
                player.playVideo();
                runde++;
                $("#overlay").fadeOut();

            }
            console.log(indeks);

        });

    } else if (spm.eventtype == "svarknap") {

        $(".container_tekst").css("opacity", "0");


        /*var HTML = "<h5 class='score'></h5>";
        HTML += "<div class='container_tekst'><div class='h4 spm_tekst'>" + tekst + "</h4>";
        HTML += "<div class ='svarcontainer'>" + options_text + "</div></div></div>";
        $(".popud").html(HTML);*/

        $(".popud").html("<h5 class='score'>Korrekte svar: <span class='score_num'>" + total_score + " ud af " + spm_length + "</span></h5><div class='container_tekst'><div class='h3 spm_tekst'>" + tekst + "</h3><div class ='svarcontainer'>" + options_text + "</div></div></div><div class='btn btn-default btn-lg btn_videre'>Angiv svar</div>");

        $(".svar_btn").click(function() {

            if (spm.eventtype == "svarknap") {
                $(".svar_btn").removeClass("btn_chosen btn-primary");
                $(".svar_btn").addClass("btn-info");
                $(this).addClass("btn_chosen btn-primary");
                $(this).removeClass("btn-info");

            } else {
                $(this).toggleClass("btn_chosen btn-primary");
                $(this).toggleClass("btn-info");
            }
            if (chosen == false) {
                $(".btn_videre").fadeIn().click(commit_answers);
                chosen = true;
            }
        });
    }

}

function commit_answers() {
    var score = 0;
    var fejl = 0;
    var valgt;
    $(".btn_videre").hide();

    if (spm.eventtype == "svarknap") {
        valgt = $(".btn_chosen").attr("id");
        if (valgt == spm.korrekt) {
            //console.log("korrekt!");
            total_score++;
            $(".btn_chosen").css("background-color", "#219121").css("border", "1px solid #219121");
            $(".score_num").fadeOut(20, function() {
                $(".score_num").html(total_score + " ud af " + spm_length);
                $(".score_num").fadeIn(); // Animation complete.
                studentanswer = true;
            });

        } else {
            $(".btn_chosen").css("background-color", "#ED3E3A").css("border", "1px solid #ed3e3a");
            studentanswer = false;
        }

    } else {
        valgt = [];

        $(".btn_chosen").each(function() {
            var indeks = $(this).index();
            var id = $(this).attr("id");
            if (spm.korrekt.indexOf(id) > -1) {
                $(this).css("background-color", "#2abb2a").css("border", "1px solid #2abb2a");
                score++;
                console.log("korrekt!");

            } else {
                fejl++;
                $(this).css("background-color", "#ed3e3a").css("border", "1px solid #ed3e3a");
                console.log("ikke korrekt: " + $(this).attr("id") + "," + spm.korrekt[1]);
            }
        });
        if (score >= spm.korrekt.length && fejl === 0) {
            console.log("Alt er korrekt... score: " + score + " antal_ svar: " + spm.korrekt.length);
            total_score++;
            $(".score_num").fadeOut(20, function() {
                $(".score_num").html(total_score);
                $(".score_num").fadeIn(); // Animation complete.
            });
        } else {
            console.log("Ikke Alt er korrekt... score: " + score + "fejl : " + fejl + " antal_ svar: " + spm.korrekt.length);

        }
    }

    $(".svar_btn").each(function() {
        if ($(this).hasClass("btn_chosen")) {

        } else {
            $(this).css("opacity", "0");
        }
    });


    feedback();
}

function feedback() {
    var correct_answers = "";

    for (var i = 0; i < spm.korrekt.length; i++) {
        correct_answers = correct_answers + "<p class='correctliste'>" + svar[spm.korrekt[i]] + "</p>";
    }

    //tween in feedback: 
    $(".svarcontainer").delay(1000).fadeOut(500, function() {
        $(".spm_tekst").fadeOut(0);
        $(".container_tekst").append("<div class='feedback'><div class='h4'>" + spm.feedback + "</div><div class = 'h4'>" + correct_answers + "<br/></div>");
        //$(".container_tekst").append("<div class='feedback'><div class='h4'>" + spm.feedback + "</div><div class = 'h4'><div class='correct_answers btn-success'>Rigtig besvarelse: </div>" + correct_answers + "<br/></div>");
        $(".popud").append("<div class ='btn btn-default btn-lg btn_videre'>Fortsæt</div>");
        $(".feedback").fadeOut(0);
        $(".feedback").fadeIn(1000);
        if (studentanswer == true){
        microhint($(".correctliste"), "<div class='microhint_label_success'>Rigtigt</div>Klik på fortsæt for at gå videre i opgaven");
        }else{
            microhint($(".correctliste"), "<div class='microhint_label_danger'>Forkert</div>Det rigtige svar står herover");
        }
     
        $("#overlay").click(next_event);
    });
}

function next_event() {
    //alert(checkTimer);
    //clearInterval(checkTimer);
    if (spm.eventtype != "info") {
        total_spm++;
    }
    //alert (events_taeller);
    events_taeller++;
    //console.log("next_event" + ", " + total_spm);
    // hvis der er flere events tilbage i stoppet:


    if (events_taeller < spm_length) {
        console.log("events_taeller < spm_length. spmtaeller=" + events_taeller + " spm_length=" + spm_length);

        $(".feedback").remove();
        $("#overlay").unbind();

        setTimeout(function() {
            stop_event(runde, events_taeller);
        }, 100);

    } else {
        console.log("events_taeller >= spm_length  spmtaeller=" + events_taeller + " spm_length=" + spm_length);

        if (runde >= stops.length - 1) {
            //console.log("tal > timestamp_Array.length - 2 ... tal: " + tal + " stops.length: " + stops.length);
            console.log("case_1");
            //NO MORE STOPS ///
            //console.log("case_slut");
            slutFeedback();

        } else {

            $("#overlay").fadeOut(1000, function() {
                //console.log("intro??")
                $(".feedback").remove();
                $("#overlay").unbind();
                resumeVideo();
                events_taeller = 0;
                runde++;
            });
        }
    }
}

/*$('#overlay').delay(3000).fadeToggle('slow', function() {
    //console.log("fjern overlay");
    resumeVideo();
    events_taeller = 0;
    runde++;
});*/



function slutFeedback() {
    //console.log("slut");
    $("#overlay").unbind();
    $(".popud").html("<h3 class = 'forfra'>Du har besvaret alle spørgsmålene. <br>Du svarede rigtigt på " + total_score + " ud af " + total_spm + " spørgsmål.</h3><div class='btn btn-default btn-lg forfra_knap'>Start forfra</div><br/><div class='btn btn-default btn-lg continue_film'>Se resten af filmen</div>");
    $(".forfra_knap").click(function() {
        //console.log ("ost");
        location.reload();
    });

    $(".continue_film").click(function() {
        $("#overlay").fadeOut(1000, function() {
            //console.log("intro??")
            $(".feedback").remove();
            $("#overlay").unbind();
            resumeVideo();
            clearInterval(checkTimer);
            events_taeller = 0;
            runde++;
        });
    });

}
