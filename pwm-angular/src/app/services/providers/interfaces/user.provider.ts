import { User } from "@models/user";

export interface UserProvider {
    
    getUserById(id: string): Promise<User>;

    addUser(User: User): Promise<string>;
}
