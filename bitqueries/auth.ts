export default class Auth {
    user: string | undefined;
    pass: string | undefined;
    rpcurl: string | undefined;
    port: number | undefined;
    url: string;

    constructor(user: string | undefined, pass: string | undefined, rpcurl: string | undefined, port: number | undefined) {
        this.user = user;
        this.pass = pass;
        this.rpcurl = rpcurl;
        this.port = port;
        this.url = `http://${user}:${pass}@${rpcurl}:${port}/`;
    }
}