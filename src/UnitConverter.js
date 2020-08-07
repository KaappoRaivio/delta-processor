export default class UnitConverter {
    constructor () {
        const knots = new Unit("kts", 3.6 / 1.852);
        const nauticalMiles = new Unit("nm", 1 / 1852);
        const degrees = new Unit("°", 180 / Math.PI);
        const percent = new Unit("%", 100);

        this.conversions = {
            "navigation.courseOverGroundTrue": degrees,
            "navigation.trip.log": nauticalMiles,
            "navigation.speedOverGround": knots,
            "navigation.speedThroughWater": knots,
            "performance.polarSpeed": knots,
            "performance.polarSpeedRatio": percent,
            "environment.wind.speedTrue": knots,
            "environment.wind.speedApparent": knots,
            "steering.rudderAngle": degrees,
        }
    }

    convert (delta) {
        if (delta.path in this.conversions) {
            let unit = this.conversions[delta.path];

            delta.value = unit.apply(delta.value);
            delta.meta.units = unit.displayName;

            if (delta.meta.displayScale) {
                delta.meta.displayScale.upper = unit.apply(delta.meta.displayScale.upper);
                delta.meta.displayScale.lower = unit.apply(delta.meta.displayScale.lower);
            }

            if (delta.meta.zones) {
                for (let zone of delta.meta.zones) {
                    if (zone.upper) zone.upper = unit.apply(zone.upper);
                    if (zone.lower) zone.lower = unit.apply(zone.lower);
                }
            }
        }
        return delta;
    }
}

class Unit {
    constructor (displayName, proportionToSIUnit) {
        this.displayName = displayName;
        this.proportionToSIUnit = proportionToSIUnit;
    }

    apply (value) {
        return this.proportionToSIUnit * value;
    }

    toString() {
        return `Unit(${this.displayName}, ${this.proportionToSIUnit})`
    }
}