class State {
    public id?: number;
    public name: string;
    public isCapital: boolean;

    constructor(name: string, isCapital: boolean) {
        this.name = name;
        this.isCapital = isCapital;
    }
}

export default State;
