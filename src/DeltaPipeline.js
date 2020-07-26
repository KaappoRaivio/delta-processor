import Pipeline from "pipeline-js";
import MetadataInserter from "./MetadataInserter.js";
import MedianCalculator from "./MedianCalculator.js";
import UnitConverter from "./UnitConverter";
import {camelCaseToSentenceCase} from "./DataStructures.js";


export default (serverAddress) => {

    const medianCalculator = new MedianCalculator();
    const medianFilter = delta => {
        return medianCalculator.getMedian(delta);
    }

    const inserter = new MetadataInserter(serverAddress)
    const metadataInserter = async delta => {
        return await inserter.insertMetadata(delta);
    }

    const displayNameInserter = delta => {
        delta.meta.displayName = camelCaseToSentenceCase(delta.path.split(".").slice(1).join(", "));
        delta.meta.decimalPlaces = 1;
        return delta;
    }

    const deltaPrinter = delta => {
        return delta;
    }

    const converter = new UnitConverter();
    const unitConverter = delta => {
        return converter.convert(delta);
    }



    return new Pipeline()
        .pipe(medianFilter)
        .pipe(metadataInserter)
        .pipe(displayNameInserter)
        .pipe(unitConverter)
        .pipe(deltaPrinter);
}