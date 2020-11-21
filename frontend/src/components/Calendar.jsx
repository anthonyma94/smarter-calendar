import React, { useState, useEffect, useReducer, useRef } from "react";
import { Container, Row, Col, DropdownButton, Button } from "react-bootstrap";
import http from "../modules/axios";
import EventModal from "./EventModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

const Calendar = () => {
  const initialState = {
    loading: true,
    cal: undefined,
    cals: undefined,
    api: undefined,
    events: [],
  };

  const calRef = useRef();

  const [showModal, setShowModal] = useState(false);

  const calReducer = (state, action) => {
    switch (action.type) {
      case "initial": {
        return {
          ...state,
          loading: false,
          cals: action.data.cals,
          cal: action.data.cals[0],
          events: action.data.events,
        };
      }
      case "setAPI": {
        return {
          ...state,
          api: calRef.current.getApi(),
        };
      }
      case "setCalByID": {
        return {
          ...state,
          cal: state.cals.find((item) => item.id === action.data),
        };
      }
      case "setEvents": {
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

  const [state, dispatch] = useReducer(calReducer, initialState);
  const { cal, cals, loading, api, events } = state;

  const getCals = async () => {
    try {
      const res = await http.get("/calendar");
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const getEvents = async (id, params) => {
    try {
      const res = await http.get(`/calendar/events/${id}`, { params });
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  // Loads initial props
  useEffect(() => {
    (async function () {
      let cals = (await getCals()).sort((a, b) =>
        a.summary.localeCompare(b.summary)
      );

      let events = await Promise.all(
        cals.map(async (item) => {
          let resp = await getEvents(item.id);
          resp = resp.map((inner) => {
            return {
              ...inner,
              calID: item.id,
              backgroundColor: item.color.background,
              textColor: "white",
            };
          });
          return resp;
        })
      );
      events = events.flat(1);

      dispatch({
        type: "initial",
        data: { cals, events },
      });
    })();
    return;
  }, []);

  // Sets API for use
  useEffect(() => {
    if (calRef.current) {
      dispatch({
        type: "setAPI",
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
            cals={cals}
          />
          <Row>
            <Col>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Show Modal
              </Button>
            </Col>
            <Col>
              <DropdownButton
                variant="primary"
                title={cal.summary}
                onSelect={(e) => {
                  dispatch({
                    type: "setCalByID",
                    data: e,
                  });
                }}
              >
                {cals.map((item) => {
                  return (
                    <DropdownItem
                      eventKey={item.id}
                      key={item.id}
                      active={item.id === cal.id}
                    >
                      {item.summary}
                    </DropdownItem>
                  );
                })}
              </DropdownButton>
            </Col>
            <Col>
              <Button
                variant="primary"
                onClick={(e) => {
                  http.get("/logout").then((res) => {
                    window.location.reload();
                  });
                }}
              >
                Log out
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <FullCalendar
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
