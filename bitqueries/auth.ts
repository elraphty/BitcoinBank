export default class Auth {
    user: string | undefined;
    pass: string | undefined;
    url: string;

    constructor(user: string | undefined, pass: string | undefined) {
        this.user = user;
        this.pass = pass;
        this.url = `http://${user}:${pass}@127.0.0.1:18443/`;
    }
}