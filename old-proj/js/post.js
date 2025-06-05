$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    function redirectHome() {
        window.location.href = './';
    }
    
    if (!postId) {
        redirectHome();
        return;
    }

    // Disable comment form if user is not logged in
    updateCommentForm();

    function updatePost(post) {
        $('.post-title').text(post.title);
        $('.post-image').attr('src', `./img/posts/${post.id}/thumbnail.jpg`);
        $('.post-image').attr('alt', post.title);
        $('.likes-count').text(post.likes);
        $('.dislikes-count').text(post.dislikes);
        $('.gallery-link').text(post.gallery.name);
        $('.gallery-link').attr('href', `./gallery.html?id=${post.gallery.id}`);
        document.title = `${post.title} - Galleros`;
        loadComments();
    }

    function loadPost() {
        $.ajax({
            url: `./api/post.php?id=${postId}`,
            method: 'GET',
            success: function(response) {
                if (!response || response.error) {
                    redirectHome();
                    return;
                }
                updatePost(response);
            },
            error: function(xhr, status, error) {
                console.error('Error loading post:', error);
                redirectHome();
            }
        });
    }

    function loadComments() {
        $.ajax({
            url: `./api/comment.php?post=${postId}`,
            method: 'GET',
            success: function(response) {
                const commentsList = $('.comments-list');
                commentsList.empty();
                
                if (!response || response.error || !response.length) {
                    commentsList.html('<p>No comments yet.</p>');
                    return;
                }
                
                response.forEach(comment => {
                    commentsList.append(createCommentElement(comment));
                });
            }
        });
    }

    function createCommentElement(comment) {
        const currentUserId = $.cookie('user_id');
        const isAuthor = currentUserId && currentUserId === comment.author.id.toString();
        
        const actions = isAuthor ? `
            <div class="comment-actions">
                <button class="comment-action edit" data-id="${comment.id}">Edit</button>
                <button class="comment-action delete" data-id="${comment.id}">Delete</button>
            </div>
        ` : '';

        return `
            <div class="comment" data-id="${comment.id}">
                <div class="comment-content-wrapper">
                    <div class="comment-author">${comment.author.name}</div>
                    <div class="comment-content">${comment.content}</div>
                </div>
                ${actions}
            </div>
        `;
    }

    // Add event handlers for comment actions
    $('.comments-list').on('click', '.comment-action.edit', function() {
        const commentId = $(this).data('id');
        const commentEl = $(`.comment[data-id="${commentId}"]`);
        const content = commentEl.find('.comment-content').text();
        
        commentEl.find('.comment-content').html(`
            <form class="edit-comment-form">
                <textarea required>${content}</textarea>
                <button type="submit">Save</button>
                <button type="button" class="cancel">Cancel</button>
            </form>
        `);
    });

    $('.comments-list').on('click', '.comment-action.delete', function() {
        const commentId = $(this).data('id');
        if (confirm('Are you sure you want to delete this comment?')) {
            $.ajax({
                url: './api/comment.php',
                method: 'DELETE',
                data: JSON.stringify({ id: commentId }),
                success: function(response) {
                    if (response && !response.error) {
                        loadComments();
                    } else {
                        alert('Failed to delete comment');
                    }
                }
            });
        }
    });

    $('.comments-list').on('submit', '.edit-comment-form', function(e) {
        e.preventDefault();
        const commentId = $(this).closest('.comment').data('id');
        const content = $(this).find('textarea').val();

        $.ajax({
            url: './api/comment.php',
            method: 'PATCH',
            data: JSON.stringify({
                id: commentId,
                content: content
            }),
            success: function(response) {
                if (response && !response.error) {
                    loadComments();
                } else {
                    alert('Failed to update comment');
                }
            }
        });
    });

    $('.comments-list').on('click', '.edit-comment-form .cancel', function() {
        loadComments();
    });

    $('.like-button, .dislike-button').on('click', function() {
        const action = $(this).hasClass('like-button') ? 'like' : 'dislike';
        $.ajax({
            url: './api/post.php',
            method: 'POST',
            data: {
                id: postId,
                action: action
            },
            success: function(response) {
                if (response && !response.error) {
                    loadPost();
                }
            }
        });
    });

    $('#comment-form').on('submit', function(e) {
        e.preventDefault();
        
        const content = $('textarea[name="content"]').val();
        
        $.ajax({
            url: './api/comment.php',
            method: 'POST',
            data: JSON.stringify( {
                post_id: postId,
                content: content
            }),
            success: function(response) {
                if (response && !response.error) {
                    loadComments();
                    $('#comment-form')[0].reset();
                } else {
                    alert('Failed to post comment: ' + (response.error || 'Unknown error'));
                }
            }
        });
    });

    function updateCommentForm() {
        const userId = $.cookie('user_id');
        const commentForm = $('#comment-form');
        
        if (!userId) {
            commentForm.find('textarea').attr('disabled', true)
                .attr('placeholder', 'Please login to comment');
            commentForm.find('button').attr('disabled', true);
        }
    }

    loadPost();
});
