class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}

class Gallery {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.author = new User(data.author);
    }

    getThumbnailUrl() {
        return `./img/galleries/${this.id}/thumbnail.jpg`;
    }
}

class Post {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.author = new User(data.author);
        this.date = new Date(data.date);
        this.likes = data.likes;
        this.dislikes = data.dislikes;
        this.gallery = data.gallery ? new Gallery(data.gallery) : null;
    }
}

class Comment {
    constructor(data) {
        this.id = data.id;
        this.content = data.content;
        this.author = new User(data.author);
        this.date = new Date(data.date);
        this.likes = data.likes;
        this.dislikes = data.dislikes;
        this.post = new Post(data.post);
    }
    
    getLikesRatio() {
        return this.likes - this.dislikes;
    }
}
