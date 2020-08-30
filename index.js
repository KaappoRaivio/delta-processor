import { getByStringPath, setByStringPath } from "./src/DeltaAssembler";
import { valueSkeleton } from "./src/DataStructures.js";
import DeltaAssembler from "./src/DeltaAssembler.js";
import { Unit } from "./src/UnitConverter.js"

export default DeltaAssembler;
export { getByStringPath, setByStringPath, valueSkeleton, Unit };
// let assembler = new DeltaAssembler("http://localhost:3000/");
// // assembler._createBranchAndLeaf("environment.depth.belowTransducer", 12)
// // assembler._createBranchAndLeaf("environment.wind.speedTrue", 24)
// // assembler._createBranchAndLeaf("navigation.speedThroughWater", 3)
// // console.log(JSON.stringify(assembler.fullState, null, " "))
// for (let i = 0; i < 1; i++) {
//     // console.log(i)
//     assembler.onDelta({
//         context: "vessels.urn:mrn:imo:mmsi:234567890",
//         updates: [
//             {
//                 source: {
//                     label: "N2000-01",
//                     type: "NMEA2000",
//                     src: "017",
//                     pgn: 127488
//                 },
//                 timestamp: "2010-01-07T07:18:44Z",
//                 values: [
//                     {
//                         path: "navigation.speedThroughWater",
//                         value: i
//                     },
//                     {
//                         path: "environment.depth.belowTransducer",
//                         value: i ** 4
//                     }
//                 ]
//             }
//         ]
//     })
// }
// // set
// console.log(assembler.toString())