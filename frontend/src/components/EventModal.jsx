import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import DatePicker, { CalendarContainer } from "react-datepicker";
import { DateTime } from "luxon";
import parseEvents from "../modules/regex";

import "react-datepicker/dist/react-datepicker.css";

const EventModal = ({ show, cals, handleClose, handleSubmit }) => {
  const [startDate, setStartDate] = useState(DateTime.local());
  const [endDate, setEndDate] = useState(DateTime.local());
  const [value, setValue] = useState();
  const [events, setEvents] = useState([]);

  // Update events on value change
  useEffect(() => {
    if (value) {
      const x = parseEvents(value);
      setEvents(x);
    }
    return;
  }, [value]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="event-name">
              <Form.Label>Event Name</Form.Label>
              <Form.Control type="text" placeholder="Enter event name" />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="event-regex">
              <Form.Label>Events</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter events"
                rows={3}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          {events.length > 0 ? (
            events.map((item) => {
              let str =
                item.startTime.toFormat("MMM dd h:mm a") +
                " - " +
                (!(
                  item.endTime.hasSame(item.startTime, "year") &&
                  item.endTime.hasSame(item.startTime, "month") &&
                  item.endTime.hasSame(item.startTime, "day")
                )
                  ? item.endTime.toFormat("MMM dd h:mm a")
                  : item.endTime.toFormat("h:mm a"));

              return (
                <Form.Row key={str}>
                  <Col>
                    <span>{str}</span>
                  </Col>
                </Form.Row>
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
        <Button variant="primary" onClick={handleSubmit || handleClose}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
