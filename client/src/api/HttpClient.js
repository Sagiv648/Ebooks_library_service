import axios from "axios";


class HttpClient{

    static #token = null;
    static #authStateSubscribers = []
    static #api =axios.create({baseURL: "http://localhost:80/api"})
    static #protectedApi = axios.create({baseURL: "http://localhost:80/api", headers: {
        authorization: this.#token
    }})
    static SubscribeAuthState(cb)
    {
        this.#authStateSubscribers.push(cb);
    }
    static async SignUp(data)
    {
        try {
            const res = await this.#api.post("/user/signup", data)
            this.#token = res.data.token;
            localStorage.setItem("token", this.#token)
            this.#authStateSubscribers.forEach((cb) => cb(this.#token))
            return res.data;
            
        } catch (error) {
            return error;
        }
    }
    static SetToken(token)
    {
        this.#token = token;
    }
    static GetToken()
    {
        const tok = localStorage.getItem('token');
        console.log("Tok is");
        console.log(tok);
        return tok;
    }
    static SignOut() {
        localStorage.removeItem("token")
        this.#token = null;
        this.#authStateSubscribers.forEach((cb) => {
            cb(null)
        })
    }
    
}
export default HttpClient