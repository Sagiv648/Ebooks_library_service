import {getStorage,uploadBytes,getDownloadURL,ref,uploadBytesResumable} from 'firebase/storage'
import app from './firebaseConfig';
import crypt from 'crypto-js'
import HttpClient from './HttpClient';
class StorageClient{
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
    static UploadEbook(data)
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
        coverMime = data.cover.split('.').slice(-1)
        const ebooksRef = ref(this.#storageInstance, `ebooks/${ebook_uploaded_name}.pdf`)
        const coverRef = ref(this.#storageInstance, `covers/${ebook_uploaded_name}.${coverMime}`)
        
        this.#uploadStartSubscribers.forEach((cb) =>cb(data))
         uploadBytesResumable(ebooksRef, data.file,{contentType: "application/pdf"}).on('state_changed', (snapshot) => { 
            
            this.#progressSubscribers.forEach((cb) => cb({name: data.file.name, 
                progress: `${(snapshot.bytesTransferred/snapshot.totalBytes).toFixed(0)*100}%`}))
            
        }, (err) => {
            console.log(err.message);
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
                    console.log(res.message);
                else
                {
                    console.log("uploaded");
                    console.log(data);
                    this.#uploadEndSubscribers.forEach((cb) => cb(res))
                }
                    
               
            })
            .catch((err) => {
                console.log(err.message);
            })
           
        })

        //console.log(data);
    }
}
export default StorageClient