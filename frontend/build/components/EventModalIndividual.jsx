"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Form_1 = __importDefault(require("react-bootstrap/Form"));
const Col_1 = __importDefault(require("react-bootstrap/Col"));
const luxon_1 = require("luxon");
const EventModalIndividual = ({ event }) => {
    const start = luxon_1.DateTime.fromISO(event.start);
    const end = luxon_1.DateTime.fromISO(event.end);
    const startStr = start.toFormat("MMM dd h:mm a");
    const endStr = !(end.hasSame(start, "year") &&
        end.hasSame(start, "month") &&
        end.hasSame(start, "day"))
        ? end.toFormat("MMM dd h:mm a")
        : end.toFormat("h:mm a");
    // const CustomTimeInput = ({ date, value, onChange }) => (
    //   <input value={value} onChange={(e) => onChange(e.target.value)} />
    // );
    // const popover = (
    //   <Popover>
    //     <DatePicker
    //       selected={startTime.toJSDate()}
    //       onChange={(date) => console.log(date)}
    //       style={{ width: "100%", height: "100%" }}
    //       inline
    //       showTimeInput
    //       customTimeInput={<CustomTimeInput />}
    //     />
    //   </Popover>
    // );
    return (<Form_1.default.Row>
      <Col_1.default>
        
        <span>{startStr}</span>
        
        <span> - </span>
        <span>{endStr}</span>
      </Col_1.default>
    </Form_1.default.Row>);
};
exports.default = EventModalIndividual;
