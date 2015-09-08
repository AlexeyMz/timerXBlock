/* Javascript for timerXBlock. */
function timerXBlockInitView(runtime, element) {
    /* Weird behaviour :
     * In the LMS, element is the DOM container.
     * In the CMS, element is the jQuery object associated*
     * So here I make sure element is the jQuery object */
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
    
    $.ajax({
        url: $countdonwn.attr("data-student-has-course-state-url"),
        success: function (studentAlreadyHasSubmissions) {
            setUpExam(studentAlreadyHasSubmissions);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Error querying student exam status " +
                "(whether it is 'not started' or 'has submissions')");
            console.log([textStatus, errorThrown]);
        }
    });
    
    function setUpExam(studentAlreadyHasSubmissions) {
        var usageId = element.attr('data-usage-id');
        var key = "timerXBlock_" + encodeURIComponent(usageId);
        var startDateText = localStorage.getItem(key);
        if (startDateText) {
            resumeTimer(new Date(startDateText));
        } else if (studentAlreadyHasSubmissions) {
            showModalOverlay($countdonwn.attr("data-l10n-exam-already-submitted"), [{
                text: $countdonwn.attr("data-l10n-action-see-results"),
                dismissOnClick: false,
                callback: function () {
                    window.location.href = "../../../progress";
                }
            }, {
                text: $countdonwn.attr("data-l10n-action-start-again"),
                dismissOnClick: false,
                callback: startExamAgain
            }]);
        } else {
            var timespanText = "";
            var limitOnlyMinutes = Math.floor(limitSeconds / 60);
            if (limitOnlyMinutes > 0) {
                timespanText += limitOnlyMinutes + " " + chooseNumberForm(
                    limitOnlyMinutes, JSON.parse($countdonwn.attr("data-l10n-minutes-forms")));
            }
            var limitOnlySeconds = limitSeconds % 60;
            if (limitOnlySeconds > 0) {
                if (timespanText.length > 0) { timespanText += " "; }
                timespanText += limitOnlySeconds + " " + chooseNumberForm(
                    limitOnlySeconds, JSON.parse($countdonwn.attr("data-l10n-seconds-forms")));
            }
            showModalOverlay($countdonwn.attr("data-l10n-start-exam").replace("{}", timespanText), [{
                text: $countdonwn.attr("data-l10n-action-begin"),
                dismissOnClick: true,
                callback: function () {
                    startDate = new Date();
                    localStorage.setItem(key, startDate);
                    resumeTimer(startDate);
                }
            }]);
        }
        
        function resumeTimer(startDate) {
            var now = new Date();
            var secondsLeft = Math.round(limitSeconds - (now - startDate) / 1000);
            console.log('seconds left: ' + secondsLeft);
            if (secondsLeft > 0) {
                $countdonwn.timeTo({
                    seconds: secondsLeft,
                    displayHours: false,
                    callback:  onLimitReached
                });
            } else {
                $countdonwn.timeTo({ seconds: 1, displayHours: false, start: false });
                onLimitReached();
            }
        }
        function onLimitReached() {
            showModalOverlay($countdonwn.attr("data-l10n-time-over"), [{
                text: $countdonwn.attr("data-l10n-action-see-results"),
                dismissOnClick: false,
                callback: function () {
                    window.location.href = "../../../progress";
                }
            }, {
                text: $countdonwn.attr("data-l10n-action-start-again"),
                dismissOnClick: false,
                callback: startExamAgain
            }]);
        }
        function startExamAgain() {
            localStorage.removeItem(key);
            $.ajax({
                url: $countdonwn.attr("data-reset-all-student-attempts-url"),
                success: refreshPage,
                error: refreshPage
            });
            function refreshPage() { window.location.reload(); }
        }
    }
    /**
     * @param contentText: string
     * @param actions: { text: string; callback: () => void, dismissOnClick: boolean }
     */
    function showModalOverlay(contentText, actions) {
        var $overlay = $(".timerModalOverlay");
        if ($overlay.length === 0) {
            $overlay = $("<div class='timerModalOverlay'/>").appendTo(document.body);
        }
        $overlay.empty().append($("<div class='timerModalContent'/>").text(contentText));
        for (var i = 0; i < actions.length; i++) {
            addAction(actions[i]);
        }
        function addAction(action) {
            $overlay.append($("<a class='timerModalAction' href='javascript:void(0)'>")
                .text(action.text)
                .click(function() {
                    if (action.dismissOnClick) { $overlay.remove(); }
                    action.callback();
                }));
        }
    }
    function chooseNumberForm(number, titles) {
        // e.g. ['one', 'three', 'five']
        cases = [2, 0, 1, 1, 1, 2];
        return titles[
            (number % 100 > 4 && number % 100 < 20)
            ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];
    }
}
