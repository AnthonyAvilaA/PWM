import { CommentModel } from "./comment";
import { News } from "./news";
import { User } from "./user";

export interface FullNewsModel {
    news: News;
    author: User;
    comments: CommentModel[];
}
