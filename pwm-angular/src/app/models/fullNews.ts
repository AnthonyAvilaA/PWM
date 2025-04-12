import { News } from "./news";
import { User } from "./user";
import { Comment } from "./comment";

export interface FullNews {
    news: News;
    author: User;
    comments: Comment[];
}
