import { User } from "./user";

export interface Comment {
    user: User;
    ID: string;
    userID: string;
    content: string;
    createdAt: string;
}
