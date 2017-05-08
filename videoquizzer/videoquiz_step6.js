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
    console.log("embed_height: " + embed_height);
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


    /////
    var options_text = "";

    //GENERER SVAR MULIGHEDER --> TWEAK IFT Hvilken type det skal være: 

    var eventtype;

    for (var i = 0; i < svar_length; i++) {

        options_text = options_text + "<div id ='" + i + "' class='btn svar_btn btn-primary'>" + svar[i] + "</div>";
        //$(".btn_videre").fadeIn().click(feed);

        /*=====  End of insert nav_stop here:  ======*/

    }



    var HTML = "<h5 class='score'>Stop nummer " + (runde + 1) + "/" + stops.length + "</h5>";
    HTML += "<div class='container_tekst'><div class='h4 spm_tekst'>" + tekst + "</h4>";
    HTML += "<div class ='svarcontainer'>" + options_text + "</div></div></div>";
    $(".popud").html(HTML);

    //$(".btn_videre").hide();

    if (spm.eventtype == "show_stop") {
        $(".svar_btn").eq(0).hide(); 
        $(".svar_btn").eq(1).hide(); 
    }

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




}

function show_hint(txt){
    microhint($(".svar_btn").eq(0), txt, "red");
}
