import getPipeline from "./DeltaPipeline.js"
import {valueSkeleton} from "./DataStructures";


export default class DeltaAssembler {
    constructor (serverAddress, changeCallback, unitConversions, callbackInterval = 0) {
        this.serverAddress = serverAddress;
        this.fullState = {
            vessels: {
                self: {

                }
            }
        }

        this.hasNewUpdates = false;

        if (callbackInterval) {
            this.changeCallback = fullState => {
                this.hasNewUpdates = true;
            }

            setInterval(() => {
                if (this.hasNewUpdates) {
                    changeCallback(JSON.parse(JSON.stringify(this.fullState)))

                    this.hasNewUpdates = false;
                }
            }, callbackInterval)
        } else {
            this.changeCallback = changeCallback;
        }


        this.pipeline = getPipeline(this.serverAddress,newDelta => {
            this._mergeToFullState(newDelta);
        }, unitConversions);
    }

    onDelta (delta) {
        this._mergeToFullState(delta);
    }

    _mergeToFullState (delta) {
        if (delta.updates) {

            delta.updates.forEach(update => update.values.forEach(value => {
                try {
                    this._processDeltaValue(value, processedValue => {
                        this._createBranchAndLeaf(processedValue.path, processedValue);
                    })
                } catch (e) {

                }
            }))
            this.changeCallback(this.fullState)
        }
    }

    _createBranchAndLeaf (branch, leaf) {
        setByStringPath(branch, this.fullState.vessels.self, leaf)
    }

    _processDeltaValue (value, callback) {
        this.pipeline.process(value)
            .then(processedDelta => {
                callback(processedDelta);
            });
    }

    toString () {
        return "Assembler: " + JSON.stringify(this.fullState, null, 4)
    }
}

export const getByStringPath = (path, object, createIfMissing=false) => {
    const pathArray = path.split(".");

    let t = pathArray.reduce((object, index) => {
        if (pathArray.indexOf(index) < pathArray.length - 1) {
            if (object[index] === undefined) {
                if (createIfMissing) {
                    object[index] = {};
                    return object[index];
                } else {
                    return valueSkeleton
                }
            }
            return object[index];
        } else {
            if (createIfMissing) {
                return object[index] || {};
            } else {
                return object[index];
            }
        }
    }, object);
    return t || valueSkeleton;
}

export const setByStringPath = (path, object, leaf) => {
    const pathArray = path.split(".");
    pathArray.reduce((object, index) => {
        if (pathArray.indexOf(index) < pathArray.length - 1) {
            if (object[index] === undefined) {
                object[index] = {};
            }
            return object[index];
        } else {
            object[index] = leaf;
            return object[index];
        }
    }, object);
}
