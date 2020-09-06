export const positionConverter = delta => {
    if (delta.path === "navigation.position.latitude") {
        delta.meta.isNumber = false;
        delta.value = ddToDms(delta.value, ["N", "S"]);
        delta.meta.displayScale.upper = 14;
        delta.meta.decimalPlaces = 0;
    } else if (delta.path === "navigation.position.longitude") {
        delta.meta.isNumber = false;
        delta.value = ddToDms(delta.value, ["E", "W"]);
        delta.meta.displayScale.upper = 14;
        delta.meta.decimalPlaces = 0;
    }
    return delta;
}

const ddToDms = (dd, letters) => {
    const moduloOfHours = dd - Math.trunc(dd);
    const orientation = dd < 0 ? letters[1] : letters[0];

    const hours = dd;
    const minutes = moduloOfHours * 60;

    const moduloOfMinutes = minutes - Math.trunc(minutes);
    const seconds = moduloOfMinutes * 60;

    return `${hours.toFixed(0)}° ${minutes.toFixed(0)}" ${seconds.toFixed(0)}' ${orientation}`
}