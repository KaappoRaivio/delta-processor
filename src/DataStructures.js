export const valueSkeleton = {
    meta: {
        units: "",
        zones: [],
        displayScale: {"upper": 0, "lower": 102, "type": "linear"},
        decimalPlaces: 1,
        displayName: "",
        isNumber: true,
    },
    value: null,
};
export const camelCaseToSentenceCase = text => {
    const separated = text.replace(/([A-Z])/g, " $1").toLowerCase();
    return separated.charAt(0).toUpperCase() + separated.slice(1);
}