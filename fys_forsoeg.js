var jsonSlides;
var complete_slides = 0;
var active_slide = 0;
var saveArray = [];
var opgave_nummer;

var audio = document.getElementById("myAudio");

var lock_mode = true;

$(document).ready(function() {



    $(".new_window_link").css("opacity", "0");

    //opgave_nummer = window.location.href.substring(window.location.href.length - 5, window.location.href.length - 6);


    //console.log("OPDSAJK: " + opgave_nummer);


    var urlvar = ReturnURLPerameters();

    if (urlvar.version == "unlocked") {
        lock_mode = false;
    };

    init();

    rotateCheck();
});

/*=============================================


=            Lav navigation og generelle funktioner            =
=============================================*/

function init() {



    //alert("opgave_nummer:" + opgave_nummer);

    jsonSlides = jsonData[0].slides;
    var navHTML = "";

    for (var i = 0; i < jsonSlides.length; i++) {
        if (lock_mode == true) {
            navHTML += "<div class='btn btn-info btn-nav locked'>" + jsonSlides[i].header + "<div class='lockicon'><span class='glyphicons glyphicons-lock'></span></div></div>";
        } else {
            navHTML += "<div class='btn btn-info btn-nav locked'>" + jsonSlides[i].header + "</div>";
        }
    }

    //console.log("complete_slides: " + complete_slides); 



    $(".top_nav_container").html(navHTML);

    if (opgave_nummer == 1) {

        $(".top_nav_container").append("<br/><a href='data/data_bolgelaengde.xlsx' target='_blank'> <div class='btn btn-primary btn_excel'><span class='glyphicon glyphicon-download-alt'></span> Download Excelark </div></a>");
        $(".top_nav_container").append("<a href='data/bolgelaengderapport.docx' target='_blank'> <div class='btn btn-primary btn_word'><span class='glyphicon glyphicon-download-alt'></span> Download Wordskabelon </div></a>");
    } else {
        $(".top_nav_container").append("<br/><a href='data/data_varmefylde.xlsx' target='_blank'> <div class='btn btn-primary btn_excel'><span class='glyphicon glyphicon-download-alt'></span> Download Excelark </div></a>");
        $(".top_nav_container").append("<a href='data/varmefylde_rapport.docx' target='_blank'> <div class='btn btn-primary btn_word'><span class='glyphicon glyphicon-download-alt'></span> Download Wordskabelon </div></a>");
    }

    $(".btn_excel").fadeOut(0);
    $(".btn_word").fadeOut(0);


    $(".btn-nav").click(function() {
        //var indeks = $(this).index; 
        clicked_nav($(this));

    });

    returnLastStudentSession();


    /*====================================================
    =            Fjern hængelåse ved complete            =
    ====================================================*/

    for (var i = 0; i < complete_slides; i++) {
        $(".glyphicons").eq(i).removeClass("glyphicons-lock");
        $(".lockicon").eq(i).remove();

    }
    $(".btn-nav").eq(active_slide).addClass("vuc-info-active").removeClass("locked");

    console.log("active_slide: " + active_slide);

    /*=====  End of Fjern hængelåse ved complete  ======*/





    //initVidQuiz(5);

    clicked_nav($(".btn-nav").eq(active_slide), "init");

    if (complete_slides == 0){
        microhint($(".btn-nav").eq(0), "Klik på navigationen og undersøg alle forsøgets dele.", true);
        microhint($(".embed-responsive"), "Se filmen før du går videre", true);

        $("body").click(function(){
            $(".microhint").remove();
        });

    }

}

/*=====  End of Section comment block  ======*/


function clicked_nav(obj, init) {



    //document.getElementById('FrameID').contentWindow.location.reload(true);


    //$(".microhint").remove();

    //document.getElementById('iframe_vid').contentWindow.helloframe();

    //document.getElementById('iframe_vid').contentWindow.location.reload(true);

    initSimplePlayer(0);
    var indeks = obj.index();
    console.log("Active slide: " + indeks);



    console.log("AS: " + active_slide);
    console.log("locked?: " + lock_mode);

    if (obj.hasClass("locked") && lock_mode == true) {
        //console.log("Se filmen før du går videre");
        //microhint(obj, "Se filmen før du går videre");
        microhint($(".btn-nav").eq(complete_slides), "Du skal være færdig med denne fane, før du kan gå videre.");
    } else {

        if (active_slide != indeks || init == "init") {
            active_slide = indeks;

            var contentHTML = "";
            contentHTML += "<div class='slide_container content_" + indeks + "'> " + jsonSlides[indeks].html_content + "</div>";

            $(".main_container").html(contentHTML);

            $(".ytp-thumbnail-overlay-image").hide();

            //console.log("URL:  " + urlen);

            $(".btn-nav").removeClass("vuc-info-active");
            $(".btn-nav").eq(indeks).addClass("vuc-info-active");
        }
    }

    //$(".new_window_link").hide();
    saveData();

    if (opgave_nummer == 1) {

        if (active_slide == 6) {
            $(".btn_excel").fadeIn(200);
        } else {
            $(".btn_excel").fadeOut(0);
        }
        if (active_slide == 7) {
            $(".btn_word").fadeIn(200);
        } else {
            $(".btn_word").fadeOut(0);
        }
    } else {

        if (active_slide == 5) {
            $(".btn_excel").fadeIn(200);
        } else {
            $(".btn_excel").fadeOut(0);
        }
        if (active_slide == 6) {
            $(".btn_word").fadeIn(200);
        } else {
            $(".btn_word").fadeOut(0);
        }
    }

    if (active_slide == 2 && opgave_nummer == 1) {

        for (var i = 0; i < jsonSlides[2].labels.length; i++) {
            var element = jsonSlides[2].labels[i];
            console.log(i + " punkt");
            //viewArray[state].append("<div><img class='gif' src=" + element.pics[state] + "></div>");
            $(".bg_container_2").append("<span class='detalje_label detalje_label_2'><img class='img-responsive' src='img/ikoninfo.png'></span>"); //glyphicon glyphicon-info-sign
            $(".detalje_label_2").eq(i).css("left", element.label_pos[0] + "%").css("top", element.label_pos[1] + "%")
                //$(".gif").eq(i).css("left", element.balance_pos[0] + "%").css("top", element.balance_pos[1] + "%");
        }
    }

    if (active_slide == 4 && opgave_nummer == 1) {
        for (var i = 0; i < jsonSlides[4].labels.length; i++) {
            var element = jsonSlides[4].labels[i];
            console.log(i + " punkt");
            //viewArray[state].append("<div><img class='gif' src=" + element.pics[state] + "></div>");
            $(".bg_container_4").append("<span class='detalje_label detalje_label_4'><img class='img-responsive' src='img/ikoninfo.png'></span>");
            $(".detalje_label_4").eq(i).css("left", element.label_pos[0] + "%").css("top", element.label_pos[1] + "%")
                //$(".gif").eq(i).css("left", element.balance_pos[0] + "%").css("top", element.balance_pos[1] + "%");
        }
    }

    if (active_slide == 3 && opgave_nummer == 2) {

        console.log("WE ARE HERE!" + active_slide);

        for (var i = 0; i < jsonSlides[3].labels.length; i++) {
            var element = jsonSlides[3].labels[i];
            console.log(i + " punkt");
            //viewArray[state].append("<div><img class='gif' src=" + element.pics[state] + "></div>");
            $(".bg_container_4").append("<span class='detalje_label detalje_label_3'><img class='img-responsive' src='img/ikoninfo.png'><span class='info_byline'>" + element.labels_txt + "</span></span>");
            $(".detalje_label_3").eq(i).css("left", element.label_pos[0] + "%").css("top", element.label_pos[1] + "%")
                //$(".gif").eq(i).css("left", element.balance_pos[0] + "%").css("top", element.balance_pos[1] + "%");
        }
    }

    $(".detalje_label_2").click(function() {
        slide_complete(3);
        $(".microhint").remove();
        var indeks = $(this).index() - 1;
        microhint($(this), jsonSlides[2].labels[indeks].info_txt);
        $(".microhint").click(function() {
            $(this).remove();
        });
    });

    $(".detalje_label_3").click(function() {
        slide_complete(4);
        $(".microhint").remove();
        var indeks = $(this).index() - 1;
        microhint($(this), jsonSlides[3].labels[indeks].info_txt);
        $(".microhint").click(function() {
            $(this).remove();
        });
    });

    $(".detalje_label_4").click(function() {
        console.log("SCP!");
        slide_complete(5);
        $(".microhint").remove();
        var indeks = $(this).index() - 1;
        microhint($(this), jsonSlides[4].labels[indeks].info_txt);
        $(".microhint").click(function() {
            $(this).remove();
        });
    });
}

function initSimplePlayer(num) {
    console.log("num: " + num);

};

function slide_complete(comp_num) {

    console.log($(".lockicon").length + ", " + $(".btn-nav").length);

    console.log("complete: " + comp_num);
    if (comp_num > complete_slides) {
        complete_slides = comp_num;
    }

    $(".btn-nav").eq(comp_num).removeClass("locked");
    $(".btn-nav").eq(comp_num).find(".lockicon").fadeOut(500);
    //$(".glyphicons").eq(active_slide).removeClass("glyphicons-lock").addClass("glyphicons-unlock");
    //$(".btn-nav").eq(active_slide + 1).removeClass("locked");
    saveData();

    //audio.play();
}

function returnLastStudentSession() {
    window.osc = Object.create(objectStorageClass);

    if (opgave_nummer == 1 && lock_mode == true) {
        osc.init('student_forsoeg_opg_1_locked');
    } else if (opgave_nummer == 1 && lock_mode == false) {
        osc.init('student_forsoeg_opg_1_free');
    } else if (opgave_nummer == 2 && lock_mode == true) {
        osc.init('student_forsoeg_opg_2_locked');
    } else if (opgave_nummer == 2 && lock_mode == false) {
        osc.init('student_forsoeg_opg_2_free');
    }

    osc.exist('jsonData');

    var TjsonData = osc.load('jsonData');
    console.log('returnLastStudentSession - TjsonData: ' + JSON.stringify(TjsonData));

    if (TjsonData) {
        complete_slides = TjsonData[0];
        active_slide = TjsonData[1];
    }

    console.log("savedData: " + complete_slides);

    $(".btn-nav").each(function() {
        var indeks = $(this).index();
        console.log("this_index:");
        if ($(this).index() <= complete_slides) {
            $(this).removeClass("locked");
            $(".lockicon").eq(indeks).fadeOut(0);
        }

    });

    //randomizeJsonDataForCheckboxesAndRadioBtns();

    // // IMPORTANT: 
    // // In this exercise, the user has to download a word-document in the last step. This is not possible when using Safari - this is why this if-clause has been added.
    // if ((isUseragentSafari()) && (typeof(safariUserHasAgreed) === 'undefined')){

    //     window.safariUserHasAgreed = false;

    //     UserMsgBox("body", '<h4>OBS</h4> <p>Du arbejder på en Mac og bruger browseren Safari. <br> Denne øvelse virker desværre ikke optimalt på Safari-platformen. Du vil ikke kunne downloade de udfyldte felter som wordfil til sidst i øvelsen.</p><br> <p>Brug i stedet <b>Chrome</b> (<a href="https://www.google.dk/chrome/browser/desktop/">Hent den her</a>) eller <b>Firefox</b>  (<a href="https://www.mozilla.org/da/firefox/new/">Hent den her</a>).</p><br> <p>Mvh <a href="https://www.vucdigital.dk">vucdigital.dk</a> </p>');

    //     $('#UserMsgBox').addClass('UserMsgBox_safari');
    //     $('.MsgBox_bgr').addClass('MsgBox_bgr_safari');

    //     $( document ).on('click', ".UserMsgBox_safari", function(event){
    //         $(".UserMsgBox_safari").fadeOut(200, function() {
    //             $(this).remove();
    //         });
    //         safariUserHasAgreed = true;
    //         returnLastStudentSession();
    //     });

    //     $( document ).on('click', ".MsgBox_bgr_safari", function(event){
    //         $(".MsgBox_bgr_safari").fadeOut(200, function() {
    //             $(this).remove();
    //         });
    //         safariUserHasAgreed = true;
    //         returnLastStudentSession();
    //     });

    //     return 0;
    // }

    /*if ((TjsonData !== null) && (typeof(TjsonData) !== 'undefined')) {
        console.log('returnLastStudentSession - getTimeStamp: ' + osc.getTimeStamp());
        // if (TjsonData !== null){
        var HTML = '';
        HTML += '<h4>OBS</h4> Du har lavet denne øvelse før og indtastet data allerede.';
        HTML += '<div> <span id="objectStorageClass_yes" class="objectStorageClass btn btn-info">Jeg vil fortsætte, hvor jeg slap</span> <span id="objectStorageClass_no" class="objectStorageClass btn btn-info">Jeg vil starte forfra</span> </div>';
        UserMsgBox("body", HTML);

        $('.CloseClass').remove(); // <---- removes the "X" in the UserMsgBox.
        $('.container-fluid').hide(); // Hide all program-content.

        $('#UserMsgBox').unbind('click');
        $('.MsgBox_bgr').unbind('click');

        $(document).on('click', "#objectStorageClass_yes", function(event) {
            console.log("objectStorageClass.init - objectStorageClass_yes - CLICK");
            $(".MsgBox_bgr").fadeOut(200, function() {
                $(this).remove();
                $('.container-fluid').fadeIn('slow'); // Fade in all program-content.
            });

            jsonData = TjsonData;
            // $('#DataInput').html(eval('step_'+TjsonData.currentStep+'_template()'));
            console.log('returnLastStudentSession - jsonData : ' + JSON.stringify(jsonData));
            //template();

        });

        $(document).on('click', "#objectStorageClass_no", function(event) {
            // osc.stopAutoSave('test1');
            console.log("objectStorageClass.init - objectStorageClass_no - CLICK");
            osc.delete(osc.localStorageObjName);
            $(".MsgBox_bgr").fadeOut(200, function() {
                $(this).remove();
                $('.container-fluid').fadeIn('slow'); // Fade in all program-content.
            });

            // step_0_template();
            //template();
            $(".generalInfo").trigger("click"); // Open the generalInfo text userMssageBox if you want to start over.
        });
    } else {
        // step_0_template();
        //template();
        $(".generalInfo").trigger("click"); // Open the generalInfo text userMssageBox if you load the program for the first time.
    }*/
}

function saveData() {
    saveArray = [];
    saveArray.push(complete_slides);
    saveArray.push(active_slide);
    console.log("saveArray: " + saveArray);
    osc.save('jsonData', saveArray);
}
