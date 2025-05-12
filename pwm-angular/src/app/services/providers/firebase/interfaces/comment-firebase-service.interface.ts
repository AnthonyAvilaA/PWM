import { CommentModel } from '../../../../models/comment.model';

/**
 * Interface defining the contract for comment provider implementations
 */
export interface CommentFirebaseServiceInterface {
    /**
     * Retrieve a comment by its ID
     * @param id Comment ID to retrieve
     * @returns Promise with the CommentModel object
     */
    getCommentById(id: string): Promise<CommentModel>;

    /**
     * Add a new comment
     * @param comment CommentModel to add
     * @returns Promise with the created comment ID
     */
    addComment(comment: CommentModel): Promise<string>;

    /**
     * Add a comment with a specific ID
     * @param comment CommentModel to add
     * @param id ID to use for the comment
     * @returns Promise with the operation result
     */
    addCommentByID(comment: CommentModel, id: string): Promise<any>;
}
