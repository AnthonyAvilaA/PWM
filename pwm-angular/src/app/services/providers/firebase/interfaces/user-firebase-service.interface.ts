import { UserModel } from "@models/user.model";

/**
 * Interface defining the contract for user provider implementations
 */
export interface UserFirebaseServiceInterface {
    /**
     * Retrieve a user by their ID
     * @param id User ID to retrieve
     * @returns Promise with the UserModel object
     */
    getUserById(id: string): Promise<UserModel>;

    /**
     * Add a new user
     * @param User UserModel to add
     * @returns Promise with the created user ID
     */
    addUser(User: UserModel): Promise<string>;
}
