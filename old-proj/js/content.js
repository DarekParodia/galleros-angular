$(document).ready(function() {
    const galleryContainer = $('.gallery-container');
    
    function createGalleryCell(gallery) {
        return `
            <a href="./gallery.html?id=${gallery.id}" class="gallery-link">
                <div class="gallery-cell">
                    <img src="${gallery.getThumbnailUrl()}" alt="${gallery.name}" class="gallery-thumbnail">
                    <div class="gallery-info">
                        <h3 class="gallery-title">${gallery.name}</h3>
                        <p class="gallery-author">by ${gallery.author.name}</p>
                    </div>
                </div>
            </a>
        `;
    }

    function loadGalleries() {
        $.ajax({
            url: './api/gallery.php',
            method: 'GET',
            success: function(response) {
                galleryContainer.empty();
                const galleries = response.map(data => new Gallery(data));
                galleries.forEach(gallery => {
                    galleryContainer.append(createGalleryCell(gallery));
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading galleries:', error);
                galleryContainer.html('<p>Error loading galleries. Please try again later.</p>');
            }
        });
    }

    loadGalleries();
});
