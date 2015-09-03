/* Javascript for timerXBlock. */
function timerXBlockInitView(runtime, element) {
    /* Weird behaviour :
     * In the LMS, element is the DOM container.
     * In the CMS, element is the jQuery object associated*
     * So here I make sure element is the jQuery object */
    debugger;
    if (element.innerHTML) element = $(element);
    var $countdonwn = element.find('.countdown');
    var limitSeconds = parseInt($countdonwn.attr('data-seconds'), 10);
    if ($(".xblock-author_view.xmodule_VerticalModule").length !== 0) {
        /* xblock rendered in author_view */
        $countdonwn.timeTo({
            seconds: limitSeconds,
            displayHours: false,
            start: false
        });
        return;
    }
    var usageId = element.attr('data-usage-id');
    var key = "timerXBlock_" + encodeURIComponent(usageId);
    var startDateText = localStorage.getItem(key);
    if (startDateText) {
        resumeTimer(new Date(startDateText));
    } else {
        showModalOverlay(
            $countdonwn.attr("data-l10n-start-exam"),
            $countdonwn.attr("data-l10n-action-begin"),
            function () {
                startDate = new Date();
                localStorage.setItem(key, startDate);
                resumeTimer(startDate);
            },
            true);
    }
    
    function resumeTimer(startDate) {
        var now = new Date();
        var secondsLeft = limitSeconds - (now - startDate) / 1000;
        console.log('seconds left: ' + secondsLeft);
        if (secondsLeft > 0) {
            $countdonwn.timeTo({
                seconds: limitSeconds,
                displayHours: false,
                callback:  onLimitReached
            });
        } else {
            $countdonwn.timeTo({ seconds: 1, displayHours: false, start: false });
            onLimitReached();
        }
    }
    function onLimitReached() {
        showModalOverlay(
            $countdonwn.attr("data-l10n-time-over"),
            $countdonwn.attr("data-l10n-action-see-results"),
            function () {
                window.location.href = "../../../progress";
            },
            false);
    }
    function showModalOverlay(contentText, actionText, actionCallback, dismissOnAction) {
        var $overlay = $(".timerModalOverlay");
        if ($overlay.length === 0) {
            $overlay = $("<div class='timerModalOverlay'/>").appendTo(document.body);
        }
        $overlay.empty()
            .append($("<div class='timerModalContent'/>").text(contentText))
            .append($("<a class='timerModalAction' href='javascript:void(0)'>")
                .text(actionText)
                .click(function() {
                    if (dismissOnAction) { $overlay.remove(); }
                    actionCallback();
                }));
    }
}
