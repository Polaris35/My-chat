export interface Provider {
    getUserData(token: string): Promise<any>;
    checkTokenValidity(token: string): Promise<boolean>;
}
