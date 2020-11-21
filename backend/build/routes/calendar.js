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
const express_1 = __importDefault(require("express"));
const jwt = __importStar(require("../middlewares/jwt"));
const google = __importStar(require("../google"));
const router = express_1.default.Router();
router.get("/", jwt.verifyToken, async (req, res) => {
    const cal = await google.getCalendars(req.token, req.query.id);
    let items = cal.items.filter((item) => item.accessRole.toLowerCase() === "owner");
    const colors = await google.getColors(req.token);
    items = items.map((item) => {
        return {
            id: item.id,
            summary: item.summary,
            timeZone: item.timeZone,
            color: colors.calendar[item.colorId],
        };
    });
    res.json(items);
});
router.get("/events/:id", jwt.verifyToken, async (req, res) => {
    let options = {};
    if (req.query.start) {
        options = {
            ...options,
            timeMin: req.query.start,
        };
    }
    if (req.query.end) {
        options = {
            ...options,
            timeMax: req.query.end,
        };
    }
    let items = Object.keys(options).length > 0
        ? await google.getEvents(req.token, req.params.id, options)
        : await google.getEvents(req.token, req.params.id);
    // const colors = await google.getColors(req.token);
    let events = items.items
        .filter((item) => item.summary && item.start && item.end)
        .map((item) => {
        return {
            id: item.id,
            title: item.summary,
            start: item.start.dateTime || item.start.date,
            end: item.end.dateTime || item.end.date,
        };
    });
    // items = items.items.map((item) => {
    //     return {
    //         id: item.id,
    //         title: item.summary,
    //         start: item.start.dateTime || item.start.date,
    //         end: item.end.dateTime || item.end.date,
    //     };
    // });
    res.json(events);
});
router.post("/events/:id", jwt.verifyToken, express_1.default.json(), async (req, res) => {
    if (!req.params.id) {
        // error
        throw Error;
    }
    console.log(req.body);
    const data = await google.addEvent(req.token, req.params.id, req.body);
});
module.exports = router;
