"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const axios_1 = __importDefault(require("./modules/axios"));
const GoogleSignIn_1 = __importDefault(require("./components/GoogleSignIn"));
const Calendar_1 = __importDefault(require("./components/Calendar"));
function App() {
    const [loggedIn, setLoggedIn] = react_1.useState(false);
    const [user, setUser] = react_1.useState();
    react_1.useEffect(() => {
        axios_1.default
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
    return (<react_bootstrap_1.Container fluid={true} className="mt-3">
      {loggedIn ? (<>
          <h3 className="text-center">Hello {user?.given_name || "User"}!</h3>
          <Calendar_1.default />
        </>) : (<GoogleSignIn_1.default />)}
    </react_bootstrap_1.Container>);
}
exports.default = App;
