import { CalendarModel } from "models/out/main";
import React from "react";
import { Button, FormCheck } from "react-bootstrap";

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
          <div style={{ width: "100%" }}>
            <div className="custom-control custom-checkbox my-1">
              <input
                type="checkbox"
                className="custom-control-input"
                id={item.id}
                style={{
                  backgroundColor: item.color?.background!,
                  color: item.color?.background!,
                }}
              />
              <label
                className="custom-control-label"
                htmlFor={item.id}
                style={{
                  display: "inline",
                  fontWeight: 500,
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.summary}
              </label>
            </div>

            {/* <div
              style={{
                backgroundColor: item.color?.background!,
                height: "1em",
                width: "1em",
                marginRight: "3px",
                borderRadius: "1em",
              }}
            ></div>
            <span
              style={{
                backgroundColor: item.color?.background as string,
                color: item.color?.foreground as string,
                fontWeight: 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.summary}
            </span> */}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
