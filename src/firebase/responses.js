import Operations from './Operations';
import { where } from 'firebase/firestore';

export default class Response extends Operations {
    constructor() {
        super('responses')
    }
    getResponsesOfCandidate(candidateId) {
        return super.get(10, [where('userId', '==', candidateId)])
    }
}