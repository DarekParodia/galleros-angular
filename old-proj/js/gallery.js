$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const galleryId = urlParams.get('id');
    
    function redirectHome() {
        window.location.href = './';
    }
    
    if (!galleryId) {
        redirectHome();
        return;
    }

    function updateGalleryHeader(gallery) {
        $('.gallery-title').text(gallery.name);
        $('.author-name').text(gallery.author.name);
        $('.gallery-thumbnail').attr('src', `./img/galleries/${gallery.id}/thumbnail.jpg`);
        document.title = `${gallery.name} - Galleros`;
        
        // Check if current user is the owner using cookie
        const currentUserId = $.cookie('user_id');
        if (currentUserId && currentUserId === gallery.author.id.toString()) {
            $('.upload-section').show();
        }
    }

    function createPostElement(post) {
        return `
            <a href="./post.html?id=${post.id}" class="post-link">
                <div class="post-card">
                    <img src="./img/posts/${post.id}/thumbnail.jpg" class="post-thumbnail" alt="${post.title}">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-stats">
                        <span class="likes">👍 ${post.likes}</span>
                        <span class="dislikes">👎 ${post.dislikes}</span>
                    </div>
                </div>
            </a>
        `;
    }

    function loadGallery() {
        $.ajax({
            url: `./api/gallery.php?id=${galleryId}`,
            method: 'GET',
            success: function(response) {
                if (!response || response.error) {
                    redirectHome();
                    return;
                }
                
                const gallery = new Gallery(response);
                updateGalleryHeader(gallery);
                
                // Load posts for this gallery
                loadPosts(galleryId);
            },
            error: function(xhr, status, error) {
                console.error('Error loading gallery:', error);
                redirectHome();
            }
        });
    }

    function loadPosts(galleryId) {
        $.ajax({
            url: `./api/post.php?gallery=${galleryId}`,
            method: 'GET',
            success: function(response) {
                if (!response || response.error) {
                    $('.posts-container').html('<p>No posts found.</p>');
                    return;
                }
                
                const postsContainer = $('.posts-container');
                postsContainer.empty();
                
                response.forEach(postData => {
                    postsContainer.append(createPostElement(postData));
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading posts:', error);
                $('.posts-container').html('<p>Error loading posts. Please try again later.</p>');
            }
        });
    }

    $('#uploadPostForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const imageFile = $('input[name="image"]')[0].files[0];
        
        if (!imageFile) {
            alert('Please select an image');
            return;
        }

        formData.append('title', $('input[name="title"]').val());
        formData.append('gallery_id', galleryId);
        formData.append('thumbnail', imageFile);
        formData.append('type', 'post');  // Add type field

        console.log('Submitting form with:', {
            title: $('input[name="title"]').val(),
            galleryId: galleryId,
            fileName: imageFile.name,
            type: 'post'
        });

        $.ajax({
            url: './api/upload.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Server response:', response);
                if (response && !response.error) {
                    loadPosts(galleryId);
                    $('#uploadPostForm')[0].reset();
                } else {
                    alert('Failed to create post: ' + (response.error || 'Unknown error'));
                }
            },
            error: function(xhr, status, error) {
                console.error('Error creating post:', {xhr, status, error});
                alert('Error creating post: ' + error);
            }
        });
    });

    loadGallery();
});
