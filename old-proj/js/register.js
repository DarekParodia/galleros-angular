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

    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        clearWarnings();
        
        const username = $('#username').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        if (!usernameRegex.test(username)) {
            showWarning('username', 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores.');
            return;
        }

        if (!passwordRegex.test(password)) {
            showWarning('password', 'Password must be between 6 and 20 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            showWarning('confirm-password', 'Passwords do not match.');
            return;
        }

        $.ajax({
            url: './api/user.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: username,
                password: password
            }),
            success: function(response) {
                if (response.error) {
                    if(response.error.includes('Duplicate entry')) {
                        showWarning('username', 'Username already exists. Please choose another one.');
                    } else 
                    showWarning('username', response.error);
                    return;
                }
                window.location.href = './login.html';
            },
            error: function(xhr, status, error) {
                console.error('Error during registration:', error);
                showWarning('username', 'Registration failed. Please try again later.');
            }
        });
    });
});
