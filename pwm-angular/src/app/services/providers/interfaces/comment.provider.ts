import { Comment } from '@models/comment';

export interface CommentProvider {
    
    getCommentById(id: string): Promise<Comment>;

    addComment(comment: Comment): Promise<string>;

    addCommentByID(comment: Comment, id: string): Promise<any>;
}
