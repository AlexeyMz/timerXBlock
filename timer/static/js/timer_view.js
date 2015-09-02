/* Javascript for timerXBlock. */
function timerXBlockInitView(runtime, element) {
    /* Weird behaviour :
     * In the LMS, element is the DOM container.
     * In the CMS, element is the jQuery object associated*
     * So here I make sure element is the jQuery object */
    if(element.innerHTML) element = $(element);
    var $countdonwn = $('#countdown');
    $countdonwn.timeTo({ seconds: parseInt($countdonwn.attr('data-seconds'), 10), displayHours: false });
}
