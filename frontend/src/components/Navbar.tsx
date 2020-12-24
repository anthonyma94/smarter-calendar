import { oauth2_v2 } from "googleapis/build/src/apis/oauth2/v2";
import React from "react";
import {
  Button,
  Col,
  DropdownButton,
  Row,
  Image,
  Navbar as NavbarBS,
  Nav,
} from "react-bootstrap";
import http from "../modules/axios";

interface Props {
  user: oauth2_v2.Schema$Userinfo;
  showModal: () => void;
}

const Navbar = ({ user, showModal }: Props) => {
  return (
    <NavbarBS className="w-100 mb-2">
      {/* <Nav className="mr-auto w-100">
        <Nav className="justify-content-center w-100">
          <Nav className="justify-content-around w-100">
            <Nav.Item>
              <Button variant="primary" onClick={showModal}>
                Add Events
              </Button>
            </Nav.Item>
          </Nav>
        </Nav>
      </Nav> */}
      <Nav variant="pills" className="w-100 justify-content-end">
        <Nav.Item>
          <Button
            variant="outline-danger"
            onClick={(e) => {
              http.get("/logout").then((res) => {
                window.location.reload();
              });
            }}
          >
            Logout
          </Button>
        </Nav.Item>
      </Nav>
    </NavbarBS>
  );

  // return (
  //   <NavbarBS>
  //     <Col>
  //       <Button variant="primary" onClick={showModal}>
  //         Show Modal
  //       </Button>
  //     </Col>
  //     {/* <Col>
  //             <DropdownButton
  //               variant="primary"
  //               title={cal!.summary}
  //               onSelect={(e) => {
  //                 dispatch({
  //                   type: ActionType.setCalByID,
  //                   data: e,
  //                 });
  //               }}
  //             >
  //               {cals!.map((item) => {
  //                 return (
  //                   <DropdownItem
  //                     eventKey={item.id}
  //                     key={item.id}
  //                     active={item.id === cal!.id}
  //                   >
  //                     {item.summary}
  //                   </DropdownItem>
  //                 );
  //               })}
  //             </DropdownButton>
  //           </Col> */}
  //     <Col>
  //       <Button
  //         variant="primary"
  //         onClick={(e) => {
  //           http.get("/logout").then((res) => {
  //             window.location.reload();
  //           });
  //         }}
  //       >
  //         Log out
  //       </Button>
  //     </Col>
  //     <Col>
  //       <Image
  //         src={user.picture as string}
  //         roundedCircle
  //         fluid
  //         style={{ height: "50px", width: "50px" }}
  //       />
  //     </Col>
  // </NavbarBS>
  // );
};

export default Navbar;
