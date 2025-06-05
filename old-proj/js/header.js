$(document).ready(function() {
    const navRight = $('.nav-right');
    
    if ($.cookie('logged_in') === 'true') {
        const username = $.cookie('username');
        navRight.html(`
            <a href="./upload.html" class="nav-link">Upload</a>
            <a href="./logout.html"><span class="nav-link">${username}</span></a>
        `);
    } else {
        navRight.html(`
            <a href="./login.html" class="nav-link">Login</a>
            <a href="./register.html" class="nav-link">Register</a>
        `);
    }
});
