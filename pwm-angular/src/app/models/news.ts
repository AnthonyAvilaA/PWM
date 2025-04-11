import { User } from "./user";

export interface News {
    title: string;
    authorID: string;
    description: string;
    content: string;
    image: string;
    categories: string[];
    usersCommentsID: string[];
    createdAt: Date;
    updatedAt: Date;
}
