export interface GameData {
    id:  string | null;
    status: string | null;
}

class Game {
    private static instance: Game;
    private id: string | null = null;
    private status: string | null = null;

    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    storeUserData(data: GameData) {
        localStorage.setItem('gameData', JSON.stringify(data));
    }

    setVariablesFromData(data: GameData) {
        this.id = data.id || null;
        this.status = data.status || null;
    }

    setStatus(status: string) {
        this.status = status;
    }

    getDataFromStorage(gameData: string) {
        return localStorage.getItem('gameData');
    }

    getData(): GameData | null {
        return ({
            id: this.id,
            status: this.status,
        });
    }

    getId(): string {
        if (this.id) {
            return this.id;
        } else {
            return "";
        }
    }

    getStatus(): string {
        if (this.status) {
            return this.status;
        } else {
            return "";
        }
    }
}

export default Game;