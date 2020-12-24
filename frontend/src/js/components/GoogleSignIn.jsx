import React from "react";
import http from "../modules/axios";
import { Button } from "react-bootstrap";

const GoogleSignIn = () => {
  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          http.get("/auth").then((res) => {
            window.location.replace(res.data);
          });
        }}
      >
        Sign In to Google
      </Button>
    </>
  );
};

export default GoogleSignIn;
