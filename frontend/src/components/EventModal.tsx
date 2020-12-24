import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import http from "../modules/axios";
import { DateTime } from "luxon";
import parseEvents from "../modules/regex";

import "react-datepicker/dist/react-datepicker.css";
import EventModalIndividual from "./EventModalIndividual";
import { CalendarModel, CalendarEventModel } from "models/out/main";

interface Props {
  show: boolean;
  cals: CalendarModel[];
  handleClose: () => void;
  handleSubmit: (event: CalendarEventModel) => void;
}

const EventModal = ({ show, cals, handleClose, handleSubmit }: Props) => {
  const [regexValue, setValue] = useState("");
  const [name, setName] = useState("");
  const [cal, setCal] = useState<CalendarModel>(cals[0]);
  const [events, setEvents] = useState<CalendarEventModel[]>([]);

  // Update events on value change
  useEffect(() => {
    if (regexValue) {
      const x = parseEvents(regexValue, cal.timeZone);
      setEvents(x);
    }
    return;
  }, [regexValue, cal]);

  const handleSubmitInternal = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    events.forEach((item) => addEvent(item));
    handleClose();
  };

  const addEvent = (event: CalendarEventModel) => {
    event.title = name;
    http
      .post(`/calendar/events/${cal.id}`, event.toGoogle())
      .then((res) => {
        handleSubmit(res.data as CalendarEventModel);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} enforceFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Col md={5}>
              <Form.Group controlId="event-name">
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter event name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Form.Group as={Col} controlId="event-cal">
              <Form.Label>Calendar</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  setCal(cals.find((item) => item.id === e.target!.value)!);
                }}
              >
                {cals.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.summary}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="event-regex">
              <Form.Label>Events</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Monday 9-5, Wed 12pm-3:30pm"
                rows={3}
                value={regexValue}
                onChange={(e) => setValue(e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          {events.length > 0 ? (
            events.map((item) => {
              return (
                <EventModalIndividual
                  key={item.start + item.end}
                  event={item}
                />
              );
            })
          ) : (
            <></>
          )}

          {/* <Form.Row>
            <Form.Group as={Col} controlId="event-start">
              <Form.Label>Event Start</Form.Label>
              <div className="m-0 p-0">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  customInput={<Form.Control />}
                />
              </div>
            </Form.Group>
            <Form.Group as={Col} controlId="event-end">
              <Form.Label>Event End</Form.Label>
              <div className="m-0 p-0">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  customInput={<Form.Control />}
                />
              </div>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="event-cal">
              <Form.Label>Calendar</Form.Label>
              <Form.Control as="select">
                {cals.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.summary}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Form.Row> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmitInternal}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
