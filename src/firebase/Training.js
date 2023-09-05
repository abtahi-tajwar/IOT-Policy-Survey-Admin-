import Operations from './Operations'
import Lesson from './Lesson'
import { arrayRemove, deleteDoc, doc, updateDoc, where, writeBatch } from 'firebase/firestore'
import { arrayUnion } from 'firebase/firestore'

export default class Training extends Operations {
    constructor() {
        super('trainings')
    }
    includeLesson (trainingId, lessonId, trainingName) {
        return new Promise(async (resolve, reject) => {
            const lesson = new Lesson()
            const lessonData = (await lesson.getById(lessonId)).response
            const trainingUpdatePromise = new Promise(async (resolve, reject) => {
                try {
                    const docRef = doc(this.db, this.collectionName, trainingId)
                    const response = await updateDoc(docRef, {
                        lessons: arrayUnion({
                            id: lessonData.id,
                            name: lessonData.data.name,
                            type: lessonData.data.type
                        }),
                        lessonIds: arrayUnion(lessonData.id)
                    })
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
                
            })
            const lessonUpdate = new Promise(async (resolve, reject) => {
                try {
                    const docRef = doc(lesson.db, lesson.collectionName, lessonData.id)
                    const response = await updateDoc(docRef, {
                        assignedTrainings: arrayUnion({
                            id: trainingId,
                            name: trainingName
                        }),
                        assignedTrainingIds: arrayUnion(trainingId)
                    })
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
                
            })
            try {
                const response = await Promise.all([trainingUpdatePromise, lessonUpdate])
                resolve(response)
            } catch (error) {
                reject(error)
            }
            
        })
    }
    unincludeLesson (trainingId, lessonId, trainingName) {
        return new Promise(async (resolve, reject) => {
            const lesson = new Lesson()
            const lessonData = (await lesson.getById(lessonId)).response
            const trainingUpdatePromise = new Promise(async (resolve, reject) => {
                try {
                    const docRef = doc(this.db, this.collectionName, trainingId)
                    const response = await updateDoc(docRef, {
                        lessons: arrayRemove({
                            id: lessonData.id,
                            name: lessonData.data.name,
                            type: lessonData.data.type
                        }),
                        lessonIds: arrayRemove(lessonData.id)
                        
                    })
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
                
            })
            const lessonUpdate = new Promise(async (resolve, reject) => {
                try {
                    const docRef = doc(lesson.db, lesson.collectionName, lessonData.id)
                    const response = await updateDoc(docRef, {
                        assignedTrainings: arrayRemove({
                            id: trainingId,
                            name: trainingName
                        }),
                        assignedTrainingIds: arrayUnion(trainingId)
                    })
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
                
            })
            try {
                const response = await Promise.all([trainingUpdatePromise, lessonUpdate])
                resolve(response)
            } catch (error) {
                reject(error)
            }
            
        })
    }
    delete(trainingId) {
        console.log("Training Id", trainingId)
        return new Promise(async (resolve, reject) => {
            const lesson = new Lesson()
            const lessonResponse = (await lesson.get(100, [where("assignedTrainingIds", "array-contains", trainingId)])).response
            console.log("Lessons to delete the data from", lessonResponse)
            const batch = writeBatch(this.db)
            lessonResponse.forEach(element => {
                const docRef = doc(this.db, lesson.collectionName, element.id)
                batch.update(docRef, { assignedTrainingIds: arrayRemove(trainingId) })
            });
            try {
                await batch.commit();
                await deleteDoc(doc(this.db, this.collectionName, trainingId))
                resolve()
            } catch (e) {
                console.log("Failed to delete lessons", e)
                reject(e)
            }
        })
    }
}