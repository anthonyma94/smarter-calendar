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
const react_bootstrap_1 = require("react-bootstrap");
const axios_1 = __importDefault(require("../modules/axios"));
const EventModal_1 = __importDefault(require("./EventModal"));
const react_2 = __importDefault(require("@fullcalendar/react"));
const daygrid_1 = __importDefault(require("@fullcalendar/daygrid"));
const DropdownItem_1 = __importDefault(require("react-bootstrap/esm/DropdownItem"));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["initial"] = 0] = "initial";
    ActionType[ActionType["setAPI"] = 1] = "setAPI";
    ActionType[ActionType["setCalByID"] = 2] = "setCalByID";
    ActionType[ActionType["setEvents"] = 3] = "setEvents";
})(ActionType || (ActionType = {}));
const Calendar = () => {
    const initialState = {
        loading: true,
        cal: undefined,
        cals: undefined,
        api: undefined,
        events: [],
    };
    const calRef = react_1.useRef(null);
    const [showModal, setShowModal] = react_1.useState(false);
    const calReducer = (state, action) => {
        switch (action.type) {
            case ActionType.initial: {
                return {
                    ...state,
                    loading: false,
                    cals: action.data.cals,
                    cal: action.data.cals[0],
                    events: action.data.events,
                };
            }
            case ActionType.setAPI: {
                return {
                    ...state,
                    api: calRef.current?.getApi(),
                };
            }
            case ActionType.setCalByID: {
                return {
                    ...state,
                    cal: state.cals.find((item) => item.id === action.data),
                };
            }
            case ActionType.setEvents: {
                return {
                    ...state,
                    events: action.data,
                };
            }
            default: {
                return state;
            }
        }
    };
    const [state, dispatch] = react_1.useReducer(calReducer, initialState);
    const { cal, cals, loading, api, events } = state;
    const getCals = async () => {
        try {
            const res = await axios_1.default.get("/calendar");
            return res.data;
        }
        catch (err) {
            console.error(err);
        }
    };
    const getEvents = async (id, params) => {
        try {
            const res = await axios_1.default.get(`/calendar/events/${id}`, { params });
            return res.data;
        }
        catch (err) {
            console.error(err);
        }
    };
    // Loads initial props
    react_1.useEffect(() => {
        (async function () {
            let cals = (await getCals()).sort((a, b) => a.summary.localeCompare(b.summary));
            // TODO: Type mapping for inner event
            let events = await Promise.all(cals.map(async (item) => {
                let resp = await getEvents(item.id);
                resp = resp.map((inner) => {
                    inner.backgroundColor = item.color?.background;
                    inner.textColor = "white";
                    return inner;
                });
                return resp;
            }));
            let flattenedEvents = events.flat(1);
            dispatch({
                type: ActionType.initial,
                data: { cals, events: flattenedEvents },
            });
        })();
        return;
    }, []);
    // Sets API for use
    react_1.useEffect(() => {
        if (!!calRef.current) {
            dispatch({
                type: ActionType.setAPI,
            });
        }
        return;
    }, [calRef]);
    return (<react_bootstrap_1.Container fluid={true} className="text-center">
      {loading ? (<h1>Loading</h1>) : (<>
          <EventModal_1.default show={showModal} handleClose={() => setShowModal(false)} cals={cals}/>
          <react_bootstrap_1.Row>
            <react_bootstrap_1.Col>
              <react_bootstrap_1.Button variant="primary" onClick={() => setShowModal(true)}>
                Show Modal
              </react_bootstrap_1.Button>
            </react_bootstrap_1.Col>
            <react_bootstrap_1.Col>
              <react_bootstrap_1.DropdownButton variant="primary" title={cal.summary} onSelect={(e) => {
        dispatch({
            type: ActionType.setCalByID,
            data: e,
        });
    }}>
                {cals.map((item) => {
        return (<DropdownItem_1.default eventKey={item.id} key={item.id} active={item.id === cal.id}>
                      {item.summary}
                    </DropdownItem_1.default>);
    })}
              </react_bootstrap_1.DropdownButton>
            </react_bootstrap_1.Col>
            <react_bootstrap_1.Col>
              <react_bootstrap_1.Button variant="primary" onClick={(e) => {
        axios_1.default.get("/logout").then((res) => {
            window.location.reload();
        });
    }}>
                Log out
              </react_bootstrap_1.Button>
            </react_bootstrap_1.Col>
          </react_bootstrap_1.Row>
          <react_bootstrap_1.Row>
            <react_bootstrap_1.Col>
              <react_2.default plugins={[daygrid_1.default]} initialView="dayGridMonth" initialDate={Date.now()} events={events} ref={calRef}/>
            </react_bootstrap_1.Col>
          </react_bootstrap_1.Row>
        </>)}
    </react_bootstrap_1.Container>);
};
exports.default = Calendar;
