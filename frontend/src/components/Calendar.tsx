import React, { useState, useEffect, useReducer, useRef } from "react";
import { Container, Row, Col, DropdownButton, Button } from "react-bootstrap";
import http from "../modules/axios";
import EventModal from "./EventModal";
import FullCalendar, { CalendarApi } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { CalendarModel, CalendarEventModel } from "models/out/main";
import { oauth2_v2 } from "googleapis/build/src/apis/oauth2";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

enum ActionType {
  initial,
  setAPI,
  setCalByID,
  setEvents,
  addEvents,
}

interface Action {
  type: ActionType;
  data?: any;
}

interface State {
  loading: boolean;
  cal: CalendarModel | undefined;
  cals: CalendarModel[] | undefined;
  api: CalendarApi | undefined;
  events: CalendarEventModel[];
}

const Calendar = ({ user }: { user: oauth2_v2.Schema$Userinfo }) => {
  const initialState: State = {
    loading: true,
    cal: undefined,
    cals: undefined,
    api: undefined,
    events: [],
  };

  const calRef = useRef<FullCalendar>(null);

  const [showModal, setShowModal] = useState(false);

  const calReducer = (state: State, action: Action): State => {
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
          cal: state.cals!.find((item) => item.id === action.data),
        };
      }
      case ActionType.setEvents: {
        return {
          ...state,
          events: action.data,
        };
      }
      case ActionType.addEvents: {
        return {
          ...state,
          events: [
            ...state.events,
            ...(Array.isArray(action.data)
              ? (action.data as CalendarEventModel[])
              : [action.data as CalendarEventModel]), // Allows adding either a single object or an array of objects
          ],
        };
      }
      default: {
        return state;
      }
    }
  };

  const [state, dispatch] = useReducer(calReducer, initialState);
  const { cal, cals, loading, api, events } = state;

  const getCals = async () => {
    try {
      const res = await http.get("/calendar");
      return res.data as CalendarModel[];
    } catch (err) {
      console.error(err);
    }
  };

  const getEvents = async (id: string, params?: any) => {
    try {
      const res = await http.get(`/calendar/events/${id}`, { params });
      return res.data as CalendarEventModel[];
    } catch (err) {
      console.error(err);
    }
  };

  // Loads initial props
  useEffect(() => {
    (async function () {
      let cals = (await getCals())!.sort((a, b) =>
        a.summary.localeCompare(b.summary)
      );

      // TODO: Type mapping for inner event
      let events = await Promise.all(
        cals.map(async (item) => {
          let resp = await getEvents(item.id);
          resp = resp!.map((inner) => {
            inner.backgroundColor = item.color?.background as string;
            inner.textColor = "white";
            return inner;
          });
          return resp;
        })
      );

      let flattenedEvents = events.flat(1);

      dispatch({
        type: ActionType.initial,
        data: { cals, events: flattenedEvents },
      });
    })();
    return;
  }, []);

  // Sets API for use
  useEffect(() => {
    if (!!calRef.current) {
      dispatch({
        type: ActionType.setAPI,
      });
    }
    return;
  }, [calRef]);

  return (
    <Container fluid={true} className="text-center">
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <>
          <EventModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            handleSubmit={(event) =>
              dispatch({
                type: ActionType.addEvents,
                data: event,
              })
            }
            cals={cals!}
          />
          <Navbar user={user} showModal={() => setShowModal(true)} />
          <Row>
            <Col className="d-none d-md-block" md={3}>
              <Sidebar
                cals={cals as CalendarModel[]}
                showModal={() => setShowModal(true)}
              />
            </Col>
            <Col md={9}>
              <FullCalendar
                windowResizeDelay={0}
                height="auto"
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                initialDate={Date.now()}
                events={events}
                ref={calRef}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Calendar;
