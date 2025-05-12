import { Timestamp } from "firebase/firestore";

export interface News {
    ID: string;
    title: string;
    authorID: string;
    description: string;
    content: string;
    image: string;
    categories: string[];
    usersCommentsID: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
