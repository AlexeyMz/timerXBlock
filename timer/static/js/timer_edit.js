/* Javascript for timerXBlock. */
function timerXBlockInitEdit(runtime, element) {
    $(element).find('.action-cancel').bind('click', function() {
        runtime.notify('cancel', {});
    });

    $(element).find('.action-save').bind('click', function() {
        var data = {
            'display_name': $('#timer_edit_display_name').val(),
            'time_limit_seconds': $('#timer_edit_time_limit_seconds').val(),
            'redirect_url': $('#timer_edit_redirect_url').val()
        };
        
        runtime.notify('save', {state: 'start'});
        
        var handlerUrl = runtime.handlerUrl(element, 'save_flash');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                runtime.notify('save', {state: 'end'});
                // Reload the whole page :
                // window.location.reload(false);
            } else {
                runtime.notify('error', {msg: response.message})
            }
        });
    });
}