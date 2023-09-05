import Operations from './Operations';
export default class ScenarioGroups extends Operations {
    constructor() {
        super('scenario_groups')
    }
    assignTraining(scenarioGroupId, trainingId) {
        return new Promise(async (resolve, reject) => {
            try {
                const updateRes = await super.update(scenarioGroupId, {
                    trainingId
                })
                resolve(updateRes)
            } catch (error) {
                console.log("Failed to assign training", error)
                reject(error)
            }
        })
    }
    unassignTraining(scenarioGroupId) {
        return new Promise(async (resolve, reject) => {
            try {
                const updateRes = await super.update(scenarioGroupId, {
                    trainingId: ""
                })
                resolve(updateRes)
            } catch (error) {
                console.log("Failed to unassign training", error)
                reject(error)
            }
        })
    }
}