export class ResponseProviderData {
    name: string;
    picture: string;
    email: string;

    constructor(data: any) {
        this.name = data.name;
        this.picture = data.picture;
        this.email = data.email;
    }
}
