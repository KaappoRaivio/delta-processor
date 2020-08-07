import createMedianFilter from "moving-median";

export default class MedianCalculator {
    constructor (windowSize=3) {
        this.medianFunctions = {};
        this.windowSize = windowSize;
    }

    getMedian (delta) {
        if (!(delta.path in this.medianFunctions)) {
            this.medianFunctions[delta.path] = createMedianFilter(this.windowSize);
        }
        let newValue = this.medianFunctions[delta.path](delta.value);

        if (!isNaN(newValue) && newValue != null) {
            delta.value = newValue;
        }

        return delta;
    }
}