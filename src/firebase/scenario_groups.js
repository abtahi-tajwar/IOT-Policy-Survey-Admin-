import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import Operations from "./Operations";
import Scenario from "./scenarios";
export default class ScenarioGroups extends Operations {
  constructor() {
    super("scenario_groups");
  }
  assignTraining(scenarioGroupId, trainingId) {
    return new Promise(async (resolve, reject) => {
      try {
        const updateRes = await super.update(scenarioGroupId, {
          trainingId,
        });
        resolve(updateRes);
      } catch (error) {
        console.log("Failed to assign training", error);
        reject(error);
      }
    });
  }
  unassignTraining(scenarioGroupId) {
    return new Promise(async (resolve, reject) => {
      try {
        const updateRes = await super.update(scenarioGroupId, {
          trainingId: "",
        });
        resolve(updateRes);
      } catch (error) {
        console.log("Failed to unassign training", error);
        reject(error);
      }
    });
  }
  assignScene(scenarioGroupId, scenarioId) {
    return new Promise(async (resolve, reject) => {
      const scenarioGroupUpdateResponse = new Promise(
        async (resolve, reject) => {
          try {
            const docRef = doc(this.db, this.collectionName, scenarioGroupId);
            const response = await updateDoc(docRef, {
              scenarios: arrayUnion(scenarioId),
            });
            resolve(response);
          } catch (error) {
            reject(error);
          }
        }
      );

      const scenarioUpdateResponse = new Promise(async (resolve, reject) => {
        try {
          const scenario = new Scenario();
          const body = {
            groupId: scenarioGroupId,
          };
          const response = scenario.update(scenarioId, body);
          debugger;
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      try {
        const response = await Promise.all([
          scenarioGroupUpdateResponse,
          scenarioUpdateResponse,
        ]);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }
  unassignScene(scenarioGroupId, scenarioId) {
    return new Promise(async (resolve, reject) => {
      const scenarioGroupUpdateResponse = new Promise(
        async (resolve, reject) => {
          try {
            const docRef = doc(this.db, this.collectionName, scenarioGroupId);
            const response = await updateDoc(docRef, {
              scenarios: arrayRemove(scenarioId),
            });
            resolve(response);
          } catch (error) {
            reject(error);
          }
        }
      );

      const scenarioUpdateResponse = new Promise(async (resolve, reject) => {
        try {
          const scenario = new Scenario();
          const body = {
            groupId: "",
          };
          const response = scenario.update(scenarioId, body);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      try {
        const response = await Promise.all([
          scenarioGroupUpdateResponse,
          scenarioUpdateResponse,
        ]);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }
}
