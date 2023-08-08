// Users.ts
import User, { UserData } from "./user";

class Users {
  private static instance: Users;
  private users: Map<string, User>;
  private state;

  private constructor() {
    this.users = new Map();
    this.state = {
      data: null
    };
  }

  static getInstance() {
    if (!Users.instance) {
      Users.instance = new Users();
    }
    return Users.instance;
  }

  addUser(userData: UserData) {
    const userId = userData.id;

    if (userId && !this.users.has(userId)) {
      const newUser = User.getInstance();
      newUser.setUserFromResponseData(userData);
      this.users.set(userId, newUser);
    }
    console.log("Users Map:", this.users);

  }


  removeUser(userId: string) {
    this.users.delete(userId);
  }

  getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }
}

export default Users;
