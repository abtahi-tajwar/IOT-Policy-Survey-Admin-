import Operations from './Operations'
import { where } from 'firebase/firestore'
export default class LessonResponse extends Operations {
    constructor() {
        super('lessson_responses')
    }
    getLessonResponsesOfCandidate(candidateId) {
        return super.get(100, [where('candidateId', '==', candidateId)])
    }
}