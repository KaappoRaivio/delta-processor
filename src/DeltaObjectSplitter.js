export default class SplitDelta {
    constructor(createDelta) {
        this.createDelta = createDelta;
    }

    process(delta) {
        if (delta.value != null && typeof delta.value === "object") {
            this.createDelta({
                updates: [
                    {
                        values: Object.keys(delta.value).map(subpath => ({
                            path: `${delta.path}.${subpath}`,
                            value: delta.value[subpath]
                        }))
                    }
                ]
            })
            throw new Error();
        } else {
            return delta;
        }
    }
}