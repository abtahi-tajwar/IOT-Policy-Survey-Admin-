import Operations from './Operations'
import { app } from './init'
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default class Gallery extends Operations {
    constructor() {
        super('gallery')
    }
    create(data) {
        return new Promise(async (resolve, reject) => {
            const db = getFirestore(app)
            try {
                const uploadResponse = await this.uploadFile(data.image.file, "gallery", "gallery/");
                const downloadUrl = await getDownloadURL(ref(this.storage, uploadResponse.filePath));
                const newData = {
                    name: data.imageName,
                    url: downloadUrl,
                    path: uploadResponse.filePath
                }
                const docRef = await addDoc(collection(db, 'gallery'), newData);
                resolve({
                    success: true,
                    response: docRef
                })
            } catch (e) {
                reject({
                    success: false,
                    response: e
                })
            }
            
        })
        
    }
}