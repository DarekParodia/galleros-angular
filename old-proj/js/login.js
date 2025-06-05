$(document).ready(function() {
    if ($.cookie('logged_in') === 'true') {
        window.location.href = './';
        return;
    }

    const passwordRegex = /^.{6,20}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    function showWarning(elementId, message) {
        $(`#${elementId}-warning`).text(message);
        $(`#${elementId}`).addClass('error');
    }

    function clearWarnings() {
        $('.form-warning').text('');
        $('.form-group input').removeClass('error');
    }

    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        clearWarnings();
        
        const username = $('#username').val();
        const password = $('#password').val();

        if (!usernameRegex.test(username)) {
            showWarning('username', 'Invalid username format.');
            return;
        }

        if (!passwordRegex.test(password)) {
            showWarning('password', 'Invalid password format.');
            return;
        }

        $.ajax({
            url: './api/auth.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: username,
                password: password
            }),
            success: function(response) {
                if (response.error) {
                    showWarning('username', response.error);
                    return;
                }
                console.log('Login successful, redirecting...');
                window.location.href = './';
            },
            error: function(xhr, status, error) {
                console.error('Error during login:', error);
                showWarning('username', 'Login failed. Please try again later.');
            }
        });
    });
});
