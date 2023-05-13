
class StorageClient{
    
    static #subscribers = []

    static SubscribeOperationsUpdates(cb)
    {
        this.#subscribers.push(cb);
    }
    static Operation(x)
    {
        console.log(`Count of subscribers is ${this.#subscribers.length}`);
        let i = 0;
        const timer = setInterval(() => {
            i++;
            this.#subscribers.forEach((cb) => {
                console.log(`from ${x}`);
                cb(i)
            })
        },10000)

        if(i == 10)
        clearInterval(timer)
        this.#subscribers.forEach((cb) => {
            cb(-1)
        })
        
    }
}
export default StorageClient