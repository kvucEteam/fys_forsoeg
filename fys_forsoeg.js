var jsonSlides;
var complete_slides = 0;
var active_slide = 0;
var saveArray = [];

$(document).ready(function() {
    returnLastStudentSession();
    init();
});


/*=============================================
=            Lav navigation og generelle funktioner            =
=============================================*/

function init() {
    jsonSlides = jsonData[0].slides;
    var navHTML = "";
    var contentHTML = "";


    for (var i = 0; i < jsonSlides.length; i++) {
        navHTML += "<div class='btn btn-info btn-nav locked'>" + jsonSlides[i].header + "<div class='lockicon'><span class='glyphicons glyphicons-lock'></span></div></div>";
        contentHTML += "<div class='slide_container content_" + i + "'> " + jsonSlides[i].html_content + "</div>";
    }

    //console.log("complete_slides: " + complete_slides);


    $(".main_container").html(contentHTML);
    $(".top_nav_container").html(navHTML);



    $(".btn-nav").click(function() {
        //var indeks = $(this).index; 
        clicked_nav($(this));

    });

    $(".slide_container").each(function() {
        var indeks = $(this).index();
        if (indeks > 0) {
            $(this).fadeOut(0);
        }
    });

    /*====================================================
    =            Fjern hængelåse ved complete            =
    ====================================================*/

    for (var i = 0; i < complete_slides + 1; i++) {
        $(".glyphicons").eq(i).removeClass("glyphicons-lock").addClass("glyphicons-unlock");
        $(".btn-nav").eq(active_slide).addClass("vuc-primary").removeClass("locked");
    }
    /*=====  End of Fjern hængelåse ved complete  ======*/



    for (var i = 0; i < jsonSlides[3].labels.length; i++) {
        var element = jsonSlides[3].labels[i];
        console.log(i + " punkt");
        //viewArray[state].append("<div><img class='gif' src=" + element.pics[state] + "></div>");
        $(".bg_container").append("<span class='btn btn-xs btn-default detalje_label'><span class='glyphicon glyphicon-info-sign'> </span> " + element.labels_txt + "</span>");
        $(".detalje_label").eq(i).css("left", element.label_pos[0] + "%").css("top", element.label_pos[1] + "%")
            //$(".gif").eq(i).css("left", element.balance_pos[0] + "%").css("top", element.balance_pos[1] + "%");
    }

    $(".detalje_label").click(function() {
        var indeks = $(this).index() - 1;
        microhint($(this), jsonSlides[3].labels[indeks].info_txt, "blue");
    });

    //initVidQuiz(5);



}

/*=====  End of Section comment block  ======*/


function clicked_nav(obj) {

    document.getElementById('iframe_vid').contentWindow.helloframe();

    initSimplePlayer(0);
    var indeks = obj.index();
    console.log(indeks);

    active_slide = indeks;

    console.log("AS: " + active_slide);

    //if (obj.hasClass("locked")) {
        console.log("Se filmen før du går videre");
    //} else {

        $(".slide_container").each(function() {
            $(this).fadeOut(0);
        })

        $(".slide_container").eq(indeks).fadeIn(500);

        $(".btn-nav").removeClass("vuc-primary");
        $(".btn-nav").eq(indeks).addClass("vuc-primary");
   // }

    //$(".new_window_link").hide();
    saveData();
}

function initSimplePlayer(num) {
    console.log("num: " + num);

};

function slide_complete(comp_num) {

    console.log("complete: " + comp_num);
    if (comp_num > complete_slides) {
        complete_slides = comp_num;
    }

    //$(".btn-nav").eq(active_slide+1).removeClass("locked"); 
    $(".glyphicons").eq(active_slide + 1).removeClass("glyphicons-lock").addClass("glyphicons-unlock");
    $(".btn-nav").eq(active_slide + 1).removeClass("locked");
    saveData();
}

function returnLastStudentSession() {
    window.osc = Object.create(objectStorageClass);
    osc.init('student_test_sesfdhsio14');
    osc.exist('jsonData');

    var TjsonData = osc.load('jsonData');
    console.log('returnLastStudentSession - TjsonData: ' + JSON.stringify(TjsonData));

    if (TjsonData) {
        complete_slides = TjsonData[0];
        active_slide = TjsonData[1];
    }

    console.log("savedData: " + complete_slides);

    $(".btn-nav").each(function(){

        if ($(this).index() < complete_slides){
            console.log("CSJASJF: " + i)
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
