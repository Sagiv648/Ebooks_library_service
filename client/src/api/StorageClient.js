import {getStorage,uploadBytes,getDownloadURL,ref,uploadBytesResumable} from 'firebase/storage'
import app from './firebaseConfig';
import crypt from 'crypto-js'
import HttpClient from './HttpClient';
import axios from 'axios';
import { storageConfig } from './firebaseConfig';
class StorageClient{


    static #api = axios.create({
        baseURL: storageConfig.base,
        validateStatus : (code) => code >= 200,
        headers: {
            application: storageConfig.application.key
        }
    })

    static #storageInstance = getStorage(app)
    static #progressSubscribers = []
    static #uploadEndSubscribers = []
    static #uploadStartSubscribers = []
    static #uploadsCounter = 0

    static SubscribeForProgress(cb,id)
    {
        this.#progressSubscribers.push({cb: cb, id: id});
    }
    static SubscribeForUploadEnd(cb,id)
    {
        this.#uploadEndSubscribers.push({cb: cb, id: id})
    }
    static SubscribeForUploadStart(cb,id)
    {
        this.#uploadStartSubscribers.push({cb: cb, id: id})
    }
    static UnsubscribeUploadStart(id)
    {
        this.#uploadStartSubscribers= this.#uploadStartSubscribers.filter((x) => x.id !== id)
    }
    static UnsubcribeUploadEnd(id)
    {
        this.#uploadEndSubscribers = this.#uploadEndSubscribers.filter((x) => x.id !== id)
    }
    static UnsubscribeUploadProgress(id)
    {
        this.#progressSubscribers = this.#progressSubscribers.filter((x) => x.id !== id)
    }
    static RemoveSubscriptions()
    {
        this.#progressSubscribers = []
        this.#uploadEndSubscribers = []
        this.#uploadStartSubscribers = []
    }
    static async UploadAvatar(data) 
    {
        const avatar_name = crypt.SHA1(data.id).toString()
        const avatar_mime = data.avatar.name.split('.').slice(-1)
        const avatarsRef = ref(this.#storageInstance, `avatars/${avatar_name}.${avatar_mime}`)
        const uploaded = await uploadBytes(avatarsRef, data.avatar, {contentType: `image/${avatar_mime}`})
        if(!uploaded)
            return null;
            console.log(uploaded);
        const url = await getDownloadURL(uploaded.ref)
        if(!url)
            return null;
        console.log(url);
        return url;
    }
     static async UploadEbook2(data,cbStart, cbProgress,cbFinished,cbError)
    {
        const item = localStorage.getItem("profile")
        if(item == null)
            return null
        const parsed = JSON.parse(item)
        const uploadIndex = this.#uploadsCounter
        this.#uploadsCounter++;
        const ebook_uploaded_name = crypt.SHA1(`${parsed.id}_${parsed.uploaded_books_count + 1}`).toString();
        let coverMime = ""
        if(data.cover)
        coverMime = data.cover.name.split('.').slice(-1)

        const uploadSize = 64*1024

        const uploadToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg1NDY0NjQ2fQ.IHn2XHtJvORl6zji1epczA1fS7y9ZWE3uxC3ywsG4bI"
        let start = 0;
        const formData = new FormData()
        formData.append('file', data.file.slice(0,start+uploadSize))
        formData.append("start", start)
        formData.append("path", "ebooks")
        formData.append("name", `${ebook_uploaded_name}.pdf`)
        formData.append("size", data.file.size)

        for(; start < data.file.size;)
        {
            const res = await axios.post('http://localhost:5000/api/files/upload', formData, {
                headers: {
                    application: "thisismykey",
                    authorization: `Bearer ${uploadToken}`,
                    "Content-Type": "multipart/form-data",
                }
            })
            if(res.status === 200)
            {
                
                formData.set('file', data.file.slice(start,start+uploadSize))
                formData.set("start", start)
                console.log(res.data);
            }
            else if(res.status === 201)
            {
                console.log("finished");
                console.log(res.data);
               
            }
            else
            {
                console.log(res.data);
                break;
            } 
            start += uploadSize
        }
        


    }
    static UploadEbook(data, cbStart, cbProgress, cbFinished,cbError)
    {
        const item = localStorage.getItem("profile")
        if(item == null)
            return null
        const parsed = JSON.parse(item)
        const uploadIndex = this.#uploadsCounter
        this.#uploadsCounter++;
        const ebook_uploaded_name = crypt.SHA1(`${parsed.id}_${parsed.uploaded_books_count + 1}`).toString();
        let coverMime = ""
        if(data.cover)
        coverMime = data.cover.name.split('.').slice(-1)
        const ebooksRef = ref(this.#storageInstance, `ebooks/${ebook_uploaded_name}.pdf`)
        const coverRef = ref(this.#storageInstance, `covers/${ebook_uploaded_name}.${coverMime}`)
        
        cbStart()
        uploadBytesResumable(ebooksRef, data.file,{contentType: "application/pdf"}).on('state_changed', (snapshot) => { 
            cbProgress({name: data.file.name, progress: `${snapshot.bytesTransferred}/${snapshot.totalBytes}`})
            //cbProgress({name: data.file.name, progress: `${(snapshot.bytesTransferred/snapshot.totalBytes).toFixed(0)*100}%`})
            
            
        }, (err) => {
            cbError(err)
        }, async () => {
            //console.log("this one");
            getDownloadURL(ebooksRef).then(async (url) => {
                data.file = url;
                if(data.cover)
                {
                    const extension = data.cover.name.split('.').slice(-1)
                    const uploaded = await uploadBytes(coverRef, data.cover, {contentType: `image/${extension}`})
                    const coverURL = await getDownloadURL(uploaded.ref);
                    data.cover = coverURL
                }
                

                const res = await HttpClient.UploadBook(data)
                if(res instanceof Error)
                    cbError(res)
                else
                {   
                    console.log("finished");
                    cbFinished(res.data)
                    
                }
                    
               
            })
            .catch((err) => {
                cbError(err)
            })
           
        })

        //console.log(data);
    }
}
export default StorageClient