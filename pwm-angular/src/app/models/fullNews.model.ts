import { NewsModel } from "./news.model";
import { UserModel } from "./user.model";
import { CommentModel } from "./comment.model";

export interface FullNewsModel {
    news: NewsModel;
    author: UserModel;
    comments: CommentModel[];
}
