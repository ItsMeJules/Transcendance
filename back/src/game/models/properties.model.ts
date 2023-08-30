export class GameProperties {
    public tCreate = Date.now();
    public tStart = Date.now();
    public id: number;
    public status = 'pending';
    public room: string;
    public countdown = -1;

    constructor(id: number, room: string) {
        this.id = id;
        this.room = room;
    }
}