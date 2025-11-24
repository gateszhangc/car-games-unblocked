window.onload = function () {
    add_plugin();
    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('#back-to-top').fadeIn();

        } else {
            $('#back-to-top').fadeOut();
        }
    });
    $("#back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 300);
    });

    $("#expand").on('click', function () {
        $("#iframehtml5").removeClass("force_half_full_screen");
        $("#iframehtml5").addClass("force_full_screen");
        $("#_exit_full_screen").removeClass('hidden');
        requestFullScreen(document.body);
    });

    $("#_exit_full_screen").on('click', cancelFullScreen);

    $(".header__bar--open").on('click', function () {
        $(".overlay").show();
        $(".nav__mobile").css({
            transform: "translate(0)"
        })
    })

    $(".close-nav").on('click', function () {
        $(".overlay").hide();
        $(".nav__mobile").css({
            transform: "translate(100%)"
        })
    })

    $(".overlay").on('click', function () {
        $(this).hide();
        $(".nav__mobile").css({
            transform: "translate(100%)"
        })
    })
}
async function paging(p) {
    await $(".gif").removeClass("hidden");
    var url = '/paging.ajax';
    $.ajax({
        type: "POST",
        url: url,
        data: {
            page: p,
            keywords: keywords,
            tag_id: tag_id,
            category_id: category_id,
            field_order: field_order,
            order_type: order_type,
            is_hot: is_hot,
            is_new: is_new,
            limit: limit,
            id_game: id_game
        },
        success: function (xxxx) {
            $(".gif").addClass("hidden");
            if (xxxx !== '') {
                $("#ajax-append").html(xxxx);
            }
        }
    });
}

function add_plugin() {
    let url = "/add-plugin.ajax";
    if (typeof id_game != 'undefined' && typeof url_game != 'undefined' && id_game != '' && url_game != '') {
        $.ajax({
            type: "POST",
            url: url,
            data: { id: id_game, url: url_game },
            success: function (data) {
                if (data) {
                    let html = JSON.parse(data);
                    if (html.html_rate) {
                        $("#append-rate").html(html.html_rate);
                    }
                    if (html.html_comment) {
                        $("#append-comment").html(html.html_comment);
                    }
                }
            }
        });
    }
}

function theaterMode() {
    let iframe = document.querySelector("#iframehtml5");
    if (iframe.classList.contains("force_half_full_screen")) {
        iframe.classList.remove("force_half_full_screen")
        document.querySelector(".header-game").classList.remove("header_game_enable_half_full_screen");
        document.body.setAttribute("style", "");
    } else {
        let above = 0;
        let left = 0;
        let below = document.querySelector(".header-game").clientHeight;
        let right = 0;
        // let width = window.innerWidth;
        // let height = window.innerHeight;
        if (!document.querySelector("#style-append")) {
            let styleElement = document.createElement("style");
            styleElement.type = "text/css";
            styleElement.setAttribute('id', "style-append");
            let cssCode = `
        .force_half_full_screen{
        position: fixed!important;
        top: 0!important;
        left: 0!important;
        z-index: 887;
        top:${above}px!important;
        left:${left}px!important;
        width:calc(100% - ${left}px)!important;
        height:calc(100% - ${above + below}px)!important;
        background-color:#000;
        }
        .header_game_enable_half_full_screen{
            position:fixed;
            left:${left}px!important;
            bottom:0!important;
            right:0!important;
            z-index:887!important;
            width:calc(100% - ${left}px)!important;
            padding-left:10px;
            padding-right:10px;
            border:0;
            border-radius:0;
        }
        @media (max-width: 1364px){
            .force_half_full_screen{
                left:0!important;
                width:100%!important;
            }
            .header_game_enable_half_full_screen{
                width:100%!important;
                left:0!important;
            }
        }`
            styleElement.innerHTML = cssCode;
            document.querySelector('head').appendChild(styleElement);
        }
        iframe.classList.add("force_half_full_screen")
        document.querySelector(".header-game").classList.add("header_game_enable_half_full_screen");
        document.body.setAttribute("style", "overflow:hidden");
    }
}
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr('href')).select();
    document.execCommand("copy");
    $temp.remove();
}
function runValidate() {
    jQuery("#contact-form").validate({
        focusInvalid: false,
        onfocusout: false,
        ignore: ".ignore",
        rules: {
            Name: {
                required: true,
                maxlength: 255,
            },
            Email: {
                required: true,
                email: true,
                maxlength: 100
            },
            Website: {
                required: false,
                maxlength: 255,
            },
            Topic: {
                required: false,
                maxlength: 255,
            },
            Message: {
                required: true,
                maxlength: 65525
            },
            "hiddenRecaptcha": {
                required: function () {
                    if (grecaptcha.getResponse() == '') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        messages: {
            Name: {
                required: "Please type your name!",
                maxlength: "255"
            },
            Email: {
                required: "Please type your email!",
                email: "Please check a valid email!",
                maxlength: "100"
            },
            Message: {
                required: "Please type your message!",
                maxlength: "65525"
            },
            "hiddenRecaptcha": {
                required: "Please verify you are human!",
            }
        },
        submitHandler: function () {
            let question_ajax = "/make-contact.ajax";
            let name = jQuery("#Name").val();
            let email = jQuery("#Email").val();
            let website = jQuery("#Website").val();
            let subject = jQuery("#Topic").val();
            let message = jQuery("#Message").val();
            let metadataload = {};
            metadataload.name = name;
            metadataload.email = email;
            metadataload.website = website;
            metadataload.subject = subject;
            metadataload.message = message;
            jQuery.ajax({
                url: question_ajax,
                data: metadataload,
                type: 'POST',
                success: function (data) {
                    if (data != 0 || data != '0') {
                        showSuccessMessage();
                    }
                }
            });
        }
    });
}
function showSuccessMessage(message) {
    document.getElementById('fcf-status').innerHTML = '';
    document.getElementById('fcf-form').style.display = 'none';
    document.getElementById('fcf-thank-you').style.display = 'block';
}

function resetFormDemo() {
    document.getElementById('fcf-form').style.display = "block";
    document.getElementById('fcf-thank-you').style.display = "none";
}
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).attr('href')).select();
    document.execCommand("copy");
    $temp.remove();
}
function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen() {
    $("#_exit_full_screen").addClass('hidden');
    $("#iframehtml5").removeClass("force_full_screen force_half_full_screen");
    var requestMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreenBtn;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitHandler() {
    if (document.webkitIsFullScreen === false
        || document.mozFullScreen === false
        || document.msFullscreenElement === false) {
        cancelFullScreen();
    }
}
