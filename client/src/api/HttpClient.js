import axios from "axios";
import {decodeToken, isExpired} from 'react-jwt'

class HttpClient{

    static #token = null;
    static #authStateSubscribers = []
    static #profileChangeSubscribers = []
    
    static #api =axios.create(
    {
    baseURL: "http://localhost:3001/api", 
    validateStatus : (code) => code >= 200
    })

    static #DownloadCountSubscribers = []


    static SubscribeDownloadCountUpdate(data) 
    {
        this.#DownloadCountSubscribers.push(data)
    }
    static UnsubscribeDownloadCountUpdate(id)
    {
        
        this.#DownloadCountSubscribers = this.#DownloadCountSubscribers.filter((entry) => entry.id !== id)
    }
    static PublishDownloadCountUpdates(data)
    {
        this.#DownloadCountSubscribers.forEach((entry) => entry.cb(data))
    }
    static SubscribeAuthState(cb)
    {
        this.#authStateSubscribers.push(cb);
    }
    static #GetToken() {
        const item = localStorage.getItem("token")
        return item;
    }
    static SubscribeProfileChange(data)
    {
        this.#profileChangeSubscribers.push(data)
    }
    static UnsubscribeProfileChange(id)
    {
        this.#profileChangeSubscribers = this.#profileChangeSubscribers.filter((entry) => entry.id !== id)
    }
    static async GetCategories() {
        
        try {
            //const token = this.#GetToken();
            const res = await this.#api.get('/categories/')
            
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error;
        }
    }
    static async SignUp(data)
    {
        try {
            const res = await this.#api.post("/user/signup", data)
            if(res.status !== 200)
                throw new Error(res.data.error)

            return res.data;
            
        } catch (error) {
            return error;
        }
    }
    static async SignIn(data)
    {
        try {
            const res = await this.#api.post("/user/signin", data)
            
            if(res.status !== 200)
                throw new Error(res.data.error)
            console.log(res.data);
            this.#token = res.data.token;
            localStorage.removeItem("confirmed")
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

    
    static isAuth()
    {
        const item = localStorage.getItem("token")
        
        return item != null;
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
    
    static async RequestResetPassword(email) {

        try {
            const res = await this.#api.post('/user/reset', {email: email})
            if(res.status !== 200)
                throw new Error(res.data.error)

            localStorage.setItem("reset_verification", JSON.stringify(res.data));
            return res.data;
        } catch (error) {
            return error;
        }
    }

    static CompareCodes(code)
    {
        try {
            const item = localStorage.getItem("reset_verification")
            if(item == null || isExpired(item))
                throw new Error("invalid code")
            const decoded = decodeToken(item);
            
            console.log(`inputted: ${code} --- code: ${decoded.code}`);
            if(decoded.code === code)
            {
                localStorage.removeItem("reset_verification")
                localStorage.setItem("confirmed", JSON.stringify({email: decoded.email,code: code, 
                    change_token: JSON.parse(item).code_verification}))
                return code;
            }
                
            throw new Error("invalid code")
        } catch (error) {
            return error;
        }
        
    }
    static async SetPassword(password) {

        try {
            const item = JSON.parse(localStorage.getItem("confirmed"))
            if(item == null)
                throw new Error("invalid fields")
            console.log(item);
            
            const res = await this.#api.put(`/user/${item.change_token}`, {email: item.email, password: password, code: item.code})
            if(res.status !== 200)
                throw new Error(res.data.error)
        } catch (error) {
            return error;
        }
    }
    static async GetUserBooks()
    {
        try {
            const token = this.#GetToken();
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.get('/user/books', 
            {
                headers:
                {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 200)
                throw new Error(res.data.error)
            
            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async GetBooks(bookId)
    {
        try {
            if(bookId)
            {
                const res = await this.#api.get(`/books/${bookId}`)
                    if(res.status !== 200)
                        throw new Error(res.data.error)
                return res.data;
            }
            else
            {
                const res = await this.#api.get('/books/')
                    if(res.status !== 200)
                        throw new Error(res.data.error)
                return res.data;
            }
            

            
        } catch (error) {
            
            return error;
        }
    }

    static async DeleteBook(book)
    {
        try {
            const token = this.#GetToken();
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.delete(`/books/${book._id}`, {headers: {
                authorization: `Bearer ${token}`
            }} )
            if(res.status !== 200)
                throw new Error(res.data.error)

            const storageItem = localStorage.getItem('profile')
            const item = JSON.parse(storageItem)
            const filteredBooks = item.uploaded_books.filter((entry) => entry._id !== book._id)
            item.uploaded_books_count = item.uploaded_books_count-1
            item.uploaded_books = filteredBooks
            localStorage.setItem('profile', JSON.stringify(item))
            this.#profileChangeSubscribers.forEach((entry) => entry.cb(res.data))
            return res.data;
        } catch (error) {
            return error;
        }
    }

    static async UploadBook(data)
    {
        try {
            const token = this.#GetToken();
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.post('/books/', {download_url: data.file, 
                cover_image: data.cover,
                description: data.description,
                authors: data.authors,
                name: data.name,
                category: data.category,
                publish_date: data.publishDate,
                uploaded_at: data.upload_date}, 
                {headers: {
                authorization: `Bearer ${token}`
            }})
            if(res.status !== 201)
                throw new Error(res.data.error)
            const localProfile = localStorage.getItem("profile")
            const parsedProfile = JSON.parse(localProfile)
            console.log("data is");
            console.log(res.data);
            parsedProfile.uploaded_books.push(res.data.book._id)
            parsedProfile.uploaded_books_count++;
            localStorage.setItem("profile", JSON.stringify(parsedProfile))
            
            return res.data.book;
            
        } catch (error) {
            return error;
        }
    }
    static async EditProfile(data)
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
            console.log(data);
            const res = await this.#api.put('/user/profile', data, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            console.log(res.data);
            if(res.status !== 200)
                throw new Error(res.data.error)
            const strItem = localStorage.getItem("profile")
            const item = JSON.parse(strItem)
            const newItem = data
            localStorage.setItem('profile', JSON.stringify(newItem))
            this.#profileChangeSubscribers.forEach((entry) => entry.cb(res.data))
            return res.data;
        } catch (error) {
            return error;
        }
    }
    static isPrivileged()
    {
        try {
            const token = this.#GetToken();
            if(!token)
                return null;
            const decoded = decodeToken(token);
            

            return this.isAuth() && (decoded.privilege === 1 || decoded.privilege === 0)
            
        } catch (error) {
            
        }
    }
    static isRingZero()
    {
        try {
            const token = this.#GetToken();
            if(!token)
                return null;
            const decoded = decodeToken(token);
            

            return this.isAuth() && decoded.privilege === 0
            
        } catch (error) {
            
        }
    }
    static async GetReviews(bookId) 
    {
        try {
            
            const res = await this.#api.get(`/reviews/${bookId}`)
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data.reviews
        } catch (error) {
            
            return error;
        }
    }
    static async PostReview(data)
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.post('/reviews/',data,
            {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 201)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error;
        }
    }
    static async SubmitBookReport(bookId)
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
                console.log(bookId);
            const res = await this.#api.put(`/books/report/${bookId}`,null,
            {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error;
        }
    }
    static async GetAllUsers()
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.get('/admin/users', {headers: {
                authorization: `Bearer ${token}`
            }})
            
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error;
        }
    }
    static async AppendCategory(name)
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.post('/admin/categories', {name: name}, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 201)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error
        }
    }
    static async DeleteAndReplaceCategory(data)
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.delete(`/admin/categories?removed_category=${data.removed_category}&replacement_category=${data.replacement_category}`,
            {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error;
        }
    }
    static async GetBooksUnfiltered()
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
            
            const res = await this.#api.get('/admin/books/', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
                if(res.status !== 200)
                    throw new Error(res.data.error)
            return res.data;
            
            

            
        } catch (error) {
            
            return error;
        }
    }
    
    static async DeleteBookAdmin(bookId)
    {
        try {
            const token = this.#GetToken()
            if(!token)
                throw new Error("invalid session")
            
            const res = await this.#api.delete(`/admin/books/${bookId}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 200)
                throw new Error(res.data.error)

            return res.data
        } catch (error) {
            return error;
        }
    }

    static async EditPermissions(data)
    {
        try {
            const token = this.#GetToken()
            if(!token || !this.isRingZero())
                throw new Error("invalid session")
            const res = await this.#api.put(`/admin/users/${data.userId}?level=${data.level}`,null,{
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data;
            
        } catch (error) {
            return error;
        }
    }
    static async ChallengeToken(cb)
    {
        try {
            const token = this.#GetToken()
            if(token)
            {
                const res = await this.#api.get('/user/challenge', {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                if(res.status !== 200)
                    throw new Error(res.data.error)
                console.log(res.data.token);
                console.log(token);
                if(res.data.token != token)
                {
                    localStorage.setItem("token", res.data.token)

                }
                cb()
            }
        } catch (error) {
            return error;
        }
    }
    static async DisciplineUser(data)
    {
        try {
            const token = this.GetToken()
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.put(`/admin/user/action/${data.userId}?action=${data.action}`,null, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error;
        }
    }
    static async GetPermissions()
    {
        try {
            const token = this.GetToken()
            if(!token)
                throw new Error("invalid session")
            const res = await this.#api.get('/user/permissions', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if(res.status !== 200)
                throw new Error(res.data.error)
            return res.data;
        } catch (error) {
            return error;
        }
    }
}
export default HttpClient