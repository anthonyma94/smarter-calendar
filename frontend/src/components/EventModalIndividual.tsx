import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { DateTime } from "luxon";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { CalendarModel, CalendarEventModel } from "models/out/main";
// import DatePicker from "react-datepicker";

interface Props {
  event: CalendarEventModel;
}

const EventModalIndividual = ({ event }: Props) => {
  const start = DateTime.fromISO(event.start);
  const end = DateTime.fromISO(event.end);

  const startStr = start.toFormat("MMM dd h:mm a");
  const endStr = !(
    end.hasSame(start, "year") &&
    end.hasSame(start, "month") &&
    end.hasSame(start, "day")
  )
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
