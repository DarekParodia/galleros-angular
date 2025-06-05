$(document).ready(function() {
    $('.upload-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = $(this).find('.submit-button');
        
        // Disable button during upload
        submitButton.prop('disabled', true);
        submitButton.text('Uploading...');

        $.ajax({
            url: './api/upload.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.error) {
                    alert(response.error);
                } else {
                    // Redirect to the gallery page
                    window.location.href = './';
                }
            },
            error: function(xhr, status, error) {
                alert('Upload failed: ' + error);
            },
            complete: function() {
                // Re-enable button
                submitButton.prop('disabled', false);
                submitButton.text('Upload');
            }
        });
    });
});
