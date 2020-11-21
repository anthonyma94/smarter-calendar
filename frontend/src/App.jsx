import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import http from "./modules/axios";
import GoogleSignIn from "./components/GoogleSignIn";
import Calendar from "./components/Calendar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    http
      .get("/")
      .then((res) => {
        setUser(res.data);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setUser(undefined);
        setLoggedIn(false);
      });
  }, []);

  return (
    <Container fluid={true} className="mt-3">
      {loggedIn ? (
        <>
          <h3 className="text-center">Hello {user.given_name || "User"}!</h3>
          <Calendar />
        </>
      ) : (
        <GoogleSignIn />
      )}
    </Container>
  );
}

export default App;
