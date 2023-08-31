
export interface UserData {
    id:  string | null;
    createdAt: string | null;
    updatedAt: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;    
    username: string | null;
    profilePicture: string | null;
    gamesPlayed: number | null;
    gamesWon: number | null;
    userPoints: number | null;
    userLevel: number | null;
    isOnline: boolean | null;
    isPlaying: boolean | null;
    currentRoom: string | null;
}

class User {
    public static instance: User;
    public id: string | null = null;
    public createdAt: string | null = null;
    public updatedAt: string | null = null;
    public email: string | null = null;
    public firstName: string | null = null;
    public lastName: string | null = null;
    public username: string | null = null;
    public profilePicture: string | null = null;
    public gamesPlayed: number | null = null;
    public gamesWon: number | null = null;
    public userPoints: number | null = null;
    public userLevel: number | null = null;
    public isOnline: boolean | null = null;
    public isPlaying: boolean | null = null;
    public currentRoom: string | null = null;

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
        this.username = data.username || null;
        this.profilePicture = data.profilePicture || null;
        this.gamesPlayed = data.gamesPlayed;
        this.gamesWon = data.gamesWon;
        this.userPoints = data.userPoints;
        this.userLevel = data.userLevel;
        this.isOnline = data.isOnline;
        this.isOnline = data.isPlaying;
        this.currentRoom = data.currentRoom;
    }

    getData(): UserData | null {
        return ({
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
        });
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
        if (this.gamesPlayed)
            return this.gamesPlayed;
        else
            return 0;
    }

    getGamesWon(): number {
        if (this.gamesWon)
            return this.gamesWon;
        else
            return 0;
    }

    getUserPoints(): number {
        if (this.userPoints)
            return this.userPoints;
        else
            return 0;
    }

    getUserLevel(): number {
        if (this.userLevel)
            return this.userLevel;
        else
            return 0;
    }

    getIsOnline(): boolean {
        if (this.isOnline)
            return this.isOnline;
        else
            return false;
    }

    getIsPlaying(): boolean {
      if (this.isPlaying)
          return this.isPlaying;
      else
          return false;
  }
}

export default User;
