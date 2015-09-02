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
    var startDate = localStorage.getItem(key);
    if (startDate) {
        startDate = new Date(startDate);
    } else {
        startDate = new Date();
        localStorage.setItem(key, startDate);
    }
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
        $countdonwn.timeTo({ seconds: 0, displayHours: false });
        onLimitReached();
    }
    function onLimitReached() {
        alert('end!');
    }
}
