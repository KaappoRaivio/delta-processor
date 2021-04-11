import Pipeline from "pipeline-js";
import DeltaObjectSplitter from "./DeltaObjectSplitter.js";
import MetadataInserter from "./MetadataInserter.js";
import MedianCalculator from "./MedianCalculator.js";
import UnitConverter, { defaultConversions } from "./UnitConverter";
import {camelCaseToSentenceCase} from "./DataStructures.js";
import {positionConverter} from "./PositionConverter";


export default (serverAddress, createDelta, unitConversions=defaultConversions) => {
    console.log(unitConversions);

    const deltaSplitter = new DeltaObjectSplitter(createDelta);
    const splitter = delta => deltaSplitter.process(delta);

    const medianCalculator = new MedianCalculator();
    const medianFilter = delta => medianCalculator.getMedian(delta)

    const inserter = new MetadataInserter(serverAddress)
    const metadataInserter = async delta => {
        return await inserter.insertMetadata(delta);
    }

    const displayNameInserter = delta => {
        delta.meta.displayName = camelCaseToSentenceCase(delta.path.split(".").slice(1).join(", "));
        return delta;
    }
    const timeStampInserter = delta => {
        delta.meta.timeStamp = new Date().toISOString()
        return delta;
    }

    const deltaPrinter = delta => {
        return delta;
    }

    const converter = new UnitConverter(unitConversions);
    const unitConverter = delta => {
        return converter.convert(delta);
    }

    const _positionConverter = delta => positionConverter(delta);

    return new Pipeline()
        // .pipe(deltaPrinter)
        .pipe(splitter)
        .pipe(medianFilter)
        .pipe(metadataInserter)
        .pipe(displayNameInserter)
        .pipe(timeStampInserter)
        .pipe(unitConverter)
        .pipe(_positionConverter)
        .pipe(deltaPrinter);
}
