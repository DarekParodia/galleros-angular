export interface UserData {
    id: number;
    name: string;
}
  
export interface GalleryData {
    id: number;
    name: string;
    author: UserData;
}
  
export interface PostData {
    id: number;
    title: string;
    content: string;
    author: UserData;
    likes: number;
    dislikes: number;
    gallery?: GalleryData;
}
  
export interface CommentData {
    id: number;
    content: string;
    author: UserData;
    likes: number;
    dislikes: number;
    post: PostData;
}
  
export class User {
    id: number;
    name: string;
  
    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
    }
}
  
export class Gallery {
    id: number;
    name: string;
    author: User;
  
    constructor(data: GalleryData) {
        this.id = data.id;
        this.name = data.name;
        this.author = new User(data.author);
    }
  
    getThumbnailUrl(): string {
        return `http://localhost:80/galleros/public/img/galleries/${this.id}/thumbnail.jpg`;
    }
}
  
export class Post {
    id: number;
    title: string;
    content: string;
    author: User;
    likes: number;
    dislikes: number;
    gallery: Gallery | null;
  
    constructor(data: PostData) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.author = new User(data.author);
        this.likes = data.likes;
        this.dislikes = data.dislikes;
        this.gallery = data.gallery ? new Gallery(data.gallery) : null;
    }
}
  
export class AppComment {
    id: number;
    content: string;
    author: User;
    likes: number;
    dislikes: number;
    post: Post;
  
    constructor(data: CommentData) {
        this.id = data.id;
        this.content = data.content;
        this.author = new User(data.author);
        this.likes = data.likes;
        this.dislikes = data.dislikes;
        this.post = new Post(data.post);
    }
    
    getLikesRatio(): number {
        return this.likes - this.dislikes;
    }
}