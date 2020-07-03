export const valueSkeleton = {
    meta: {
        units: null,
        zones: [],
        displayScale: {"upper": null, "lower": null, "type": "linear"},
        decimalPlaces: 1,
        displayName: ""
    },
    value: null,
};
export const camelCaseToSentenceCase = text => {
    const separated = text.replace(/([A-Z])/g, " $1").toLowerCase();
    return separated.charAt(0).toUpperCase() + separated.slice(1);
}