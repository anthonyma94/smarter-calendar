"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Modal_1 = __importDefault(require("react-bootstrap/Modal"));
const Button_1 = __importDefault(require("react-bootstrap/Button"));
const Form_1 = __importDefault(require("react-bootstrap/Form"));
const Col_1 = __importDefault(require("react-bootstrap/Col"));
const axios_1 = __importDefault(require("../modules/axios"));
const regex_1 = __importDefault(require("../modules/regex"));
require("react-datepicker/dist/react-datepicker.css");
const EventModalIndividual_1 = __importDefault(require("./EventModalIndividual"));
const EventModal = ({ show, cals, handleClose, handleSubmit }) => {
    const [regexValue, setValue] = react_1.useState("");
    const [name, setName] = react_1.useState("");
    const [cal, setCal] = react_1.useState(cals[0]);
    const [events, setEvents] = react_1.useState([]);
    // Update events on value change
    react_1.useEffect(() => {
        if (regexValue) {
            const x = regex_1.default(regexValue, cal.timeZone);
            setEvents(x);
        }
        return;
    }, [regexValue, cal]);
    const handleSubmitInternal = (e) => {
        e.preventDefault();
        events.forEach((item) => addEvent(item));
    };
    const addEvent = (event) => {
        event.title = name;
        axios_1.default
            .post(`/calendar/events/${cal.id}`, event.toGoogle())
            .then((res) => {
            console.log(res);
        })
            .catch((err) => {
            console.error(err);
        });
    };
    return (<Modal_1.default show={show} onHide={handleClose} enforceFocus={false}>
      <Modal_1.default.Header closeButton>
        <Modal_1.default.Title>Add Event</Modal_1.default.Title>
      </Modal_1.default.Header>
      <Modal_1.default.Body>
        <Form_1.default>
          <Form_1.default.Row>
            <Col_1.default md={5}>
              <Form_1.default.Group controlId="event-name">
                <Form_1.default.Label>Event Name</Form_1.default.Label>
                <Form_1.default.Control type="text" placeholder="Enter event name" value={name} onChange={(e) => setName(e.target.value)}/>
              </Form_1.default.Group>
            </Col_1.default>
            <Form_1.default.Group as={Col_1.default} controlId="event-cal">
              <Form_1.default.Label>Calendar</Form_1.default.Label>
              <Form_1.default.Control as="select" onChange={(e) => {
        setCal(cals.find((item) => item.id === e.target.value));
    }}>
                {cals.map((item) => {
        return (<option key={item.id} value={item.id}>
                      {item.summary}
                    </option>);
    })}
              </Form_1.default.Control>
            </Form_1.default.Group>
          </Form_1.default.Row>
          <Form_1.default.Row>
            <Form_1.default.Group as={Col_1.default} controlId="event-regex">
              <Form_1.default.Label>Events</Form_1.default.Label>
              <Form_1.default.Control as="textarea" placeholder="Monday 9-5, Wed 12pm-3:30pm" rows={3} value={regexValue} onChange={(e) => setValue(e.target.value)}/>
            </Form_1.default.Group>
          </Form_1.default.Row>
          {events.length > 0 ? (events.map((item) => {
        return (<EventModalIndividual_1.default key={item.start + item.end + item.id} event={item}/>);
    })) : (<></>)}

          
        </Form_1.default>
      </Modal_1.default.Body>
      <Modal_1.default.Footer>
        <Button_1.default variant="secondary" onClick={handleClose}>
          Close
        </Button_1.default>
        <Button_1.default variant="primary" onClick={handleSubmitInternal}>
          Add
        </Button_1.default>
      </Modal_1.default.Footer>
    </Modal_1.default>);
};
exports.default = EventModal;
