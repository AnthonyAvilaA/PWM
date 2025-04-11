import { User } from "./user";

export interface Comment {
    user: User
    content: string;
    createdAt: string;
}
