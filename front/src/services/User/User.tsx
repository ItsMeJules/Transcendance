export interface UserData {
  id: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string;
  profilePicture: string;
  gamesPlayed: number | null;
  gamesWon: number | null;
  userPoints: number | null;
  userLevel: number | null;
  isOnline: boolean | null;
  isPlaying: boolean | null;
  currentRoom: string | null;
  blockedUsers: number[];
}

class User {
  public isPlaying: boolean | null = null;
  private static instance: User;
  public id: string | null = null;
  private createdAt: string | null = null;
  private updatedAt: string | null = null;
  private email: string | null = null;
  private firstName: string | null = null;
  private lastName: string | null = null;
  private username: string = "";
  private profilePicture: string = "";
  private gamesPlayed: number | null = null;
  private gamesWon: number | null = null;
  private userPoints: number | null = null;
  private userLevel: number | null = null;
  private isOnline: boolean | null = null;
  private currentRoom: string | null = null;
  private blockedUsers: number[] = [];

  static getInstance() {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  }

  setUserFromResponseData(data: UserData) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.email = data.email || null;
    this.firstName = data.firstName || null;
    this.lastName = data.lastName || null;
    this.username = data.username;
    this.profilePicture = data.profilePicture;
    this.gamesPlayed = data.gamesPlayed;
    this.gamesWon = data.gamesWon;
    this.userPoints = data.userPoints;
    this.userLevel = data.userLevel;
    this.isOnline = data.isOnline;
    this.isOnline = data.isPlaying;
    this.currentRoom = data.currentRoom;
    this.currentRoom = data.currentRoom;
    this.blockedUsers = data.blockedUsers;
  }

  getData(): UserData | null {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      profilePicture: this.profilePicture,
      gamesPlayed: this.gamesPlayed,
      gamesWon: this.gamesWon,
      userPoints: this.userPoints,
      userLevel: this.userLevel,
      isOnline: this.isOnline,
      isPlaying: this.isPlaying,
      currentRoom: this.currentRoom,
      blockedUsers: this.blockedUsers,
    };
  }

  getId(): string {
    if (this.id) {
      return this.id;
    } else {
      return "";
    }
  }

  getEmail(): string {
    if (this.email) {
      return this.email;
    } else {
      return "";
    }
  }

  getUsername(): string {
    if (this.username) {
      return this.username;
    } else {
      return "";
    }
  }

  getFirstName(): string {
    if (this.firstName) {
      return this.firstName;
    } else {
      return "";
    }
  }

  getLastName(): string {
    if (this.lastName) {
      return this.lastName;
    } else {
      return "";
    }
  }

  getProfilePicture(): string {
    if (this.profilePicture) {
      return this.profilePicture;
    } else {
      return "";
    }
  }

  getGamesPlayed(): number {
    if (this.gamesPlayed) return this.gamesPlayed;
    else return 0;
  }

  getGamesWon(): number {
    if (this.gamesWon) return this.gamesWon;
    else return 0;
  }

  getUserPoints(): number {
    if (this.userPoints) return this.userPoints;
    else return 0;
  }

  getUserLevel(): number {
    if (this.userLevel) return this.userLevel;
    else return 0;
  }

  getIsOnline(): boolean {
    if (this.isOnline) return this.isOnline;
    else return false;
  }

  getIsPlaying(): boolean {
    if (this.isPlaying) return this.isPlaying;
    else return false;
  }
}

export default User;
