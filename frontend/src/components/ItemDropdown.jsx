import React, { Fragment } from "react";
import { DropdownButton } from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";

const ItemDropdown = ({ items, defaultItem, setItem }) => {
    const defaultValue =
        typeof defaultItem === "object" ? defaultItem.value : defaultItem;

    return (
        <Fragment>
            <DropdownButton
                title={defaultItem}
                onSelect={(eventKey) => {
                    setItem(eventKey);
                }}
            >
                {items.map((i) => {
                    return (
                        <DropdownItem
                            eventKey={i}
                            key={i}
                            active={i === defaultItem}
                        >
                            {i}
                        </DropdownItem>
                    );
                })}
            </DropdownButton>
        </Fragment>
    );
};

export default ItemDropdown;
