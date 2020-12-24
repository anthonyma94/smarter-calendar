import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import DatePicker from "react-datepicker";

const EventModalIndividual = ({ event }) => {
  const { startTime, endTime } = event;

  const startStr = startTime.toFormat("MMM dd h:mm a");
  const endStr = !(
    endTime.hasSame(startTime, "year") &&
    endTime.hasSame(startTime, "month") &&
    endTime.hasSame(startTime, "day")
  )
    ? endTime.toFormat("MMM dd h:mm a")
    : endTime.toFormat("h:mm a");

  const CustomTimeInput = ({ date, value, onChange }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  );
  const popover = (
    <Popover>
      <DatePicker
        selected={startTime.toJSDate()}
        onChange={(date) => console.log(date)}
        style={{ width: "100%", height: "100%" }}
        inline
        showTimeInput
        customTimeInput={<CustomTimeInput />}
      />
    </Popover>
  );

  return (
    <Form.Row>
      <Col>
        {/* <OverlayTrigger trigger="click" placement="auto-end" overlay={popover}> */}
        <span>{startStr}</span>
        {/* </OverlayTrigger> */}
        <span> - </span>
        <span>{endStr}</span>
      </Col>
    </Form.Row>
  );
};

export default EventModalIndividual;
