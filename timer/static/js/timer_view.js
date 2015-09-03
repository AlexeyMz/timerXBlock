/* Javascript for timerXBlock. */
function timerXBlockInitView(runtime, element) {
    /* Weird behaviour :
     * In the LMS, element is the DOM container.
     * In the CMS, element is the jQuery object associated*
     * So here I make sure element is the jQuery object */
    debugger;
    if (element.innerHTML) element = $(element);
    var $countdonwn = element.find('.countdown');
    var usageId = element.attr('data-usage-id');
    var key = "timerXBlock_" + encodeURIComponent(usageId);
    var startDateText = localStorage.getItem(key);
    if (startDateText) {
        resumeTimer(new Date(startDateText));
    } else {
        showModalOverlay("START_EXAM", "ACTION_BEGIN", function () {
            startDate = new Date();
            localStorage.setItem(key, startDate);
            resumeTimer(startDate);
        });
    }
    
    function resumeTimer(startDate) {
        var limitSeconds = parseInt($countdonwn.attr('data-seconds'), 10);
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
        showModalOverlay("TIME_OVER", "ACTION_SEE_RESULTS", function () {
            window.location.href = "../../progress";
        });
    }
    function showModalOverlay(contentText, actionText, actionCallback) {
        var $overlay = $(".timerModalOverlay");
        if ($overlay.length === 0) {
            $overlay = $("<div class='timerModalOverlay'/>").appendTo(document.body);
        }
        $overlay.empty()
            .append($("<div class='timerModalContent'/>").text(contentText))
            .append($("<a class='timerModalAction'>")
                .text(actionText)
                .click(actionCallback));
    }
}
