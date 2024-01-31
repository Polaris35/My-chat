export class GoogleRensponse {
    name: string;
    picture: string;
    email: string;

    constructor(data: object) {
        Object.assign(this, data);
    }
}
