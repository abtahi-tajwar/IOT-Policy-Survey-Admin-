import { app } from "./init";
import {
  collection,
  query,
  limit,
  where,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getFirestore,
  startAfter,
  getCountFromServer
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";

export default class Operations {
  constructor(collectionName) {
    const _db = getFirestore(app);
    this.db = _db;
    this.collectionName = collectionName;
    this.collectionRef = collection(_db, collectionName);
    this.lastDocument = null;
    this.storage = getStorage()
  }
  count() {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getCountFromServer(this.collectionRef);
      resolve(snapshot.data().count);
    });
  }
  get(lim = 100, queryParams = null) {
    return new Promise(async (resolve, reject) => {
      let q = null;
      let isLastPage = false;
      q = this._createPaginatedQuery(lim, queryParams)
      try {
        const querySnapshot = await getDocs(q);
        this.lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];

        /** Check for last page 
         * There are 2 possible scenarios
         *  1. Last page will contain less amount of items then limit
         *  2. Last page will have same amount of items as limit
         *    a) That case, we will make another call to check if more item exists, if more item does not exist -> last page
         */ 
        // There are 2 possible scenarios

        if (querySnapshot.docs.length < lim) {
          isLastPage = true;
        } else {
          // If last page has same amount of children as limit
          const q2 = this._createPaginatedQuery(1, queryParams)
          const querySnapshot2 = await getDocs(q2);
          if (querySnapshot2.docs.length === 0) {
            isLastPage = true;
          }
        }
        const result = [];
        querySnapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        resolve({
          success: true,
          isLastPage,
          response: result
        });
      } catch (e) {
        reject({
          success: false,
          response: e
        })
      }
      
    });
  }
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const querySnapshot = await getDocs(this.collectionRef);
        const result = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          result.push({
            id: doc.id,
            data: doc.data()
          });
        });
        resolve({
          success: true,
          response: result
        })
      } catch (e) {
        reject({
          success: false,
          response: e
        })
      }
    })
  }
  getById(id, fileDataKeys = []) {
    return new Promise(async (resolve, reject) => {
      const docRef = doc(this.db, this.collectionName, id);
      try {
        const docSnap = await getDoc(docRef);
        const response = {
            id: docSnap.id,
            data: docSnap.data(),
        }
        // for(let i = 0; i < fileDataKeys.length; i++) {
        //     const file = await this.downloadFile(response.data[fileDataKeys[i]])
        //     response.data[fileDataKeys[i]] = file
        // }
        response.data = await this.iterateAndDownload(response.data, fileDataKeys)
        resolve({
          success: true,
          response,
        });
      } catch (e) {
        reject({
          success: false,
          error: e,
        });
      }
    });
  }
  create(data) {
    this.iterateAndUpload(data).then(res => {
      console.log("Final data after upload", res)
    })
    return new Promise(async (resolve, reject) => {

      // Upload all the files seperately
      // const _object_keys = Object.keys(data);
      // for (let i = 0; i < _object_keys.length; i++) {
      //   const _inputObj = data[_object_keys[i]];
      //   if (_inputObj.type === "file") {
      //     const uploadResponse = await this.uploadFile(_inputObj.file, this.collectionName, this.collectionName+"/");
      //     data[_object_keys[i]] = uploadResponse.filePath;
      //   }
      // }
      // Add a new document with a generated id.
      try {
        // Upload all the files seperately
        const modifiedData = await this.iterateAndUpload(data)
        const docRef = await addDoc(this.collectionRef, modifiedData);
        resolve({
          success: true,
          doc: docRef,
        });
      } catch (e) {
        reject({
          success: false,
          error: e,
        });
      }
    });
  }
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      const docRef = doc(this.db, this.collectionName, id);
      // const _object_keys = Object.keys(data);
      // Upload all the files seperately
      // for (let i = 0; i < _object_keys.length; i++) {
      //   const _inputObj = data[_object_keys[i]];
      //   if (_inputObj.type === "file") {
      //     if ("previous" in _inputObj) {
      //       await deleteObject(ref(this.storage, _inputObj.previous))
      //     }
      //     const uploadResponse = await this.uploadFile(_inputObj.file, "scene");
      //     data[_object_keys[i]] = uploadResponse.filePath;
      //   }
      // }
      try {
        const modifiedData = await this.iterateAndUpload(data)
        const res = await updateDoc(docRef, modifiedData);
        resolve({
          success: true,
          response: res,
        });
      } catch (e) {
        reject({
          success: false,
          error: e,
        });
      }
    });
  }
  delete(obj, fileKeys = []) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < fileKeys.length; i++) {
        await deleteObject(ref(this.storage, obj.data[fileKeys[i]]))
      }
      const docRef = doc(this.db, this.collectionName, obj.id);
      try {
        const res = await deleteDoc(docRef);
        resolve({
          success: true,
          response: res,
        });
      } catch (e) {
        reject({
          success: false,
          error: e,
        });
      }
    });
  }
  uploadFile(file, fileNamePrefix = "prefix", destinationFolder="scene/") {
    return new Promise(async (resolve, reject) => {
      // Create a root reference
      const storage = getStorage();
      const extension = file.name ? file.name.split(".")[file.name.split(".").length-1] : ''
      // Create a reference to 'mountains.jpg'
      const filePath = `${destinationFolder}${fileNamePrefix}_${new Date().getTime()}.${extension}`;
      const storageRef = ref(storage, filePath);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        resolve({
          success: true,
          filePath: filePath,
          snapshot,
        });
      } catch (e) {
        reject({
          success: false,
          error: e,
        });
      }
    });
  }
  iterateAndUpload (data) {
    return new Promise(async (resolve, reject) => {
      if (data instanceof File || data instanceof Blob) {
          try {
            const uploadResponse = await this.uploadFile(data.file ?? data, this.collectionName, this.collectionName+"/")
            resolve(uploadResponse.filePath)
          } catch (e) {
            reject(e)
          }
      } else if (data instanceof Array) {
        const _newArr = []
        for (const item of data) {
          _newArr.push(await this.iterateAndUpload(item))
        }
        resolve(_newArr)
      } else if (data instanceof Object) {
        const newObj = {}
        for (const key of Object.keys(data)) {
          newObj[key] = await this.iterateAndUpload(data[key])
        }
        resolve(newObj)
      } else {
        resolve(data)
      }
    })
    
  }
  downloadFile(url) {
    return (
      new Promise(async (resolve, reject) => {
        const storage = getStorage();
        try {
          const reference = ref(storage, url);
          const downloadUrl = await getDownloadURL(reference);
          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const blob = xhr.response;
            resolve(blob)
          };
          xhr.open("GET", downloadUrl);
          xhr.send();
        } catch (e) {
          reject(e);
        }
      })
    );
  }
  iterateAndDownload (data, fileDataKeys = []) {
    console.log("Current Iterate and download data", data)
    return new Promise(async (resolve, reject) => {
      if (data instanceof Array) {
        const _newArr = []
        for (const item of data) {
          _newArr.push(await this.iterateAndDownload(item, fileDataKeys))
        }
        resolve(_newArr)
      } else if (data instanceof Object) {
        const newObj = {}
        for (const key of Object.keys(data)) {
          if (fileDataKeys.includes(key)) {
            console.log("Image should be download", key, data[key])
            try {
              const file = await this.downloadFile(data[key])
              newObj[key] = file
            } catch (e) {
              newObj[key] = ''
            }
          } else {
            newObj[key] = await this.iterateAndDownload(data[key], fileDataKeys)
          }
        }
        resolve(newObj)
      } else {
        resolve(data)
      }
    })
    
  }
  _createPaginatedQuery(lim, queryParams) {
    let q = null
    if (this.lastDocument) {
      if (queryParams) {
        q = query(
          this.collectionRef,
          limit(lim),
          startAfter(this.lastDocument),
          ...queryParams
        );
      } else {
        q = query(
          this.collectionRef,
          limit(lim),
          startAfter(this.lastDocument)
        );
      }
    } else {
      if (queryParams) {
        q = query(this.collectionRef, limit(lim), ...queryParams);
      } else {
        q = query(this.collectionRef, limit(lim));
      }
    }
    return q
  }
}
