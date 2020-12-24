import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import http from "./modules/axios";
import GoogleSignIn from "./components/GoogleSignIn";
import Calendar from "./components/Calendar";
import { oauth2_v2 } from "googleapis/build/src/apis/oauth2/index";
import Navbar from "./components/Navbar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<oauth2_v2.Schema$Userinfo>({});

  useEffect(() => {
    http
      .get("/")
      .then((res) => {
        setUser(res.data);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setUser({});
        setLoggedIn(false);
      });
  }, []);

  return (
    <Container fluid={true} className="mt-3">
      {loggedIn ? (
        <>
          <Calendar user={user} />
        </>
      ) : (
        <GoogleSignIn />
      )}
    </Container>
  );
}

export default App;
