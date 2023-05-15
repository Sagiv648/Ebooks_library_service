import axios from "axios";


class HttpClient{

    static #token = null;
    static #authStateSubscribers = []
    static #api =axios.create(
    {
    baseURL: "http://localhost:80/api", 
    validateStatus : (code) => code >= 200
    })

    static #protectedApi = axios.create(
        {
    baseURL: "http://localhost:80/api", 
    headers: {
        authorization: this.#token
    },
    validateStatus : (code) => code >= 200
       
    
    })
    static SubscribeAuthState(cb)
    {
        this.#authStateSubscribers.push(cb);
    }
    static async SignUp(data)
    {
        try {
            const res = await this.#api.post("/user/signup", data)
            if(res.status != 201)
                throw new Error(res.data.error)

            this.#token = res.data.token;
            localStorage.setItem("token", this.#token)
            localStorage.setItem("profile", JSON.stringify( res.data.profile))


            this.#authStateSubscribers.forEach((cb) => cb(res.data.profile))
            return res.data.profile;
            
        } catch (error) {
            return error;
        }
    }
    static async SignIn(data)
    {
        try {
            const res = await this.#api.post("/user/signin", data)
            
            if(res.status != 200)
                throw new Error(res.data.error)
            console.log(res.data);
            this.#token = res.data.token;
            localStorage.setItem("token", this.#token)
            localStorage.setItem("profile", JSON.stringify( res.data.profile))
            
            

            this.#authStateSubscribers.forEach((cb) => cb(res.data.profile))
            return res.data.profile;
            
        } catch (error) {
            return error;
        }
    }
    static GetProfile() {
        const item = localStorage.getItem("profile")
        if(item)
            return JSON.parse(item)
        return item;
    }
    static FetchStorage(cb) {
        const item = localStorage.getItem("token")
        const profile = localStorage.getItem("profile")

        //console.log(item);
        if(item && profile)
        {
            this.#token = item;
            
            
            cb(JSON.parse(profile))
        }
        else
        {
            cb(null)
        }
    }

    static SetToken(token)
    {
        this.#token = token;
    }
    static isAuth()
    {
        return this.#token != null
    }
    static GetToken()
    {
        const tok = localStorage.getItem('token');
        
        return tok;
    }
    static SignOut() {
        localStorage.removeItem("token")
        localStorage.removeItem("profile")
        this.#token = null;
        this.#authStateSubscribers.forEach((cb) => {
            cb(null)
        })
    }
    
}
export default HttpClient