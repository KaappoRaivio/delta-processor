import createMedianFilter from "moving-median";

const median = createMedianFilter(4);

export default class MedianCalculator {
    constructor (windowSize=3) {
        this.medianFunctions = {};
        this.windowSize = windowSize;
    }

    getMedian (delta) {
        if (!(delta.path in this.medianFunctions)) {
            this.medianFunctions[delta.path] = createMedianFilter(this.windowSize);
        }
        const oldValue = delta.value
        delta.value = this.medianFunctions[delta.path](delta.value);
        return delta;
    }
}