export class ResponseProviderData {
    name: string;
    picture: number;
    email: string;

    constructor(data: ResponseProviderData) {
        Object.assign(this, data);
    }
}
