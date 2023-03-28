import { app } from './init'
import { collection, query, limit, getDocs, getFirestore, getCountFromServer } from "firebase/firestore";

export default class Operations {
    constructor(collectionName) {
        const _db = getFirestore(app)
        this.db = _db
        this.collectionRef = collection(_db, collectionName);
        this.lastDocument = null
    }
    count() {
        return new Promise(async (resolve, reject) => {
            const snapshot = await getCountFromServer(this.collectionRef);
            resolve(snapshot.data().count)
        })  
    }
    get(lim=10) {
        return new Promise(async (resolve, reject) => {
            let q = null
            if (this.lastDocument) {
                q = query(this.collectionRef, limit(lim), startAfter(this.lastDocument))
            } else {
                q = query(this.collectionRef, limit(lim))
            }
            
            const querySnapshot = await getDocs(q)
            this.lastDocument = querySnapshot.docs[querySnapshot.docs.length-1];
            const result = []
            querySnapshot.forEach(doc => {
                result.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            resolve(result)
        })
    }
}