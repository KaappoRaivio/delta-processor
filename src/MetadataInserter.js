import fetch from "node-fetch";
import urlJoin from "url-join";
import {valueSkeleton} from "./DataStructures.js";

import { cloneDeep } from "lodash";

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
            const meta = cloneDeep(this.metaCache[delta.path]);
            return {...delta, meta};
        } else {
            return fetch(HTTPPath)
                .then(async response => {
                    if (response.status === 404) {
                        console.log("error!")
                        return {};
                    } else {
                        return await response.json();
                    }
                })
                .then(meta => {
                    if (!(delta.path in this.metaCache)) {
                        console.log("No cache hit!")
                        this.metaCache[delta.path] = cloneDeep(meta);
                    }
                    return meta;
                })
                .then(meta => ({...delta, meta}))
                .catch(err => ({...delta, meta: valueSkeleton}))
        }
    }
}