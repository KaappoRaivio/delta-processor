import fetch from "node-fetch";
import urlJoin from "url-join";
import {valueSkeleton} from "./DataStructures.js";

const pathRegexToHTTP = path => "/".concat(path.toString()
    .replace(/([\\+.])+/g, "/")
    .concat("/"))
    .replace(/\/+/g, "/")

const APIPath = "/signalk/v1/api/vessels/self";
export default class MetadataInserter {

    constructor (serverAddress) {
        this.APIEndPoint = urlJoin(serverAddress, APIPath)
        this.metaCache = {}
    }

    async insertMetadata (delta) {
        let HTTPPath = urlJoin(urlJoin(this.APIEndPoint, pathRegexToHTTP(delta.path)), "meta")

        if (delta.path in this.metaCache) {
            const meta = JSON.parse(JSON.stringify(this.metaCache[delta.path]));
            return {...delta, meta};
        } else {
            return fetch(HTTPPath)
                .then(response => {
                    if (response.status === 404) {
                        return new Promise(resolve => {resolve(valueSkeleton.meta)});
                    } else {
                        return response.json();
                    }
                })
                .catch(err => new Promise(resolve => {resolve(valueSkeleton.meta)}))
                .then(meta => {
                    meta = {...valueSkeleton.meta, ...meta}
                    if (delta.path === "navigation.position.latitude" || delta.path === "navigation.position.longitude") {
                        meta.isNumber = false;
                    }

                    if (!(delta.path in this.metaCache)) {
                        this.metaCache[delta.path] = JSON.parse(JSON.stringify(meta));
                    }

                    return meta;
                })
                .then(meta => ({...delta, meta}))
        }
    }
}