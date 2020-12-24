import { CalendarModel } from "models/out/main";
import React from "react";
import { Button } from "react-bootstrap";

const Sidebar = ({
  cals,
  showModal,
}: {
  cals: CalendarModel[];
  showModal: () => void;
}) => {
  return (
    <div style={{ width: "100%" }}>
      <Button
        className="d-block mx-auto mb-5"
        variant="primary"
        onClick={showModal}
      >
        Add Events
      </Button>
      <span style={{ fontWeight: "bold" }}>Calendars</span>
      {cals.map((item) => {
        return (
          <p
            style={{
              backgroundColor: item.color?.background as string,
              color: item.color?.foreground as string,
              fontWeight: 400,
            }}
          >
            {item.summary}
          </p>
        );
      })}
    </div>
  );
};

export default Sidebar;
