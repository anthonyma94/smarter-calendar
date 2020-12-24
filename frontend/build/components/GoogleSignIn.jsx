"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const axios_1 = __importDefault(require("../modules/axios"));
const react_bootstrap_1 = require("react-bootstrap");
const GoogleSignIn = () => {
    return (<>
      <react_bootstrap_1.Button variant="primary" onClick={() => {
        axios_1.default.get("/auth").then((res) => {
            window.location.replace(res.data);
        });
    }}>
        Sign In to Google
      </react_bootstrap_1.Button>
    </>);
};
exports.default = GoogleSignIn;
