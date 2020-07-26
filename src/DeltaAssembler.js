import getPipeline from "./DeltaPipeline.js"
import math from "mathjs";
import {valueSkeleton} from "./DataStructures";


export default class DeltaAssembler {
    constructor (serverAddress, changeCallback) {
        this.serverAddress = serverAddress;
        this.fullState = {
            vessels: {
                self: {

                }
            }
        }
        this.changeCallback = changeCallback;
        this.pipeline = getPipeline(this.serverAddress);
    }

    onDelta (delta) {
        this._mergeToFullState(delta);
    }

    _mergeToFullState (delta) {
        if (delta.updates)  {
            delta.updates.forEach(update => update.values.forEach(value => {
                this._processDeltaValue(value, processedValue => {
                    this._createBranchAndLeaf(processedValue.path, processedValue);
                    this.changeCallback(this.fullState)
                })
            }))
        }
    }

    _createBranchAndLeaf (branch, leaf) {
        setByStringPath(branch, this.fullState.vessels.self, leaf)
    }

    _processDeltaValue (delta, callback) {
        this.pipeline.process(delta)
            .then(processedDelta => {
                // console.log(processedDelta)
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
        // console.log("DeltaAssembler", object, index);
        if (pathArray.indexOf(index) < pathArray.length - 1) {
            if (object[index] === undefined) {
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
            if (object[index] === undefined) {
                object[index] = {};
            }
            return object[index];
        } else {
            object[index] = leaf;
            return object[index];
        }
    }, object);
}
