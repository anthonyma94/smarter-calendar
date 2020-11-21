"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEvent = exports.getEvents = exports.getColors = exports.getCalendars = exports.getUserInfo = exports.getToken = exports.getAuthURL = void 0;
const googleapis_1 = require("googleapis");
const luxon_1 = require("luxon");
const fs_1 = __importDefault(require("fs"));
const SCOPE = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.profile",
];
const credentials = JSON.parse(fs_1.default.readFileSync("credentials.json").toString())
    .web;
const { client_secret, client_id, redirect_uris } = credentials;
const oauthClient = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris);
const setCredentials = (token) => {
    const { access, refresh, scope, type, id, expiry, iat } = token;
    if (!access || !refresh || !scope || !type || !id || !expiry || !iat) {
        // error
    }
    oauthClient.setCredentials(token);
};
const getCalendar = (token) => {
    setCredentials(token);
    return googleapis_1.google.calendar({ version: "v3", auth: oauthClient });
};
const getUser = (token) => {
    setCredentials(token);
    return googleapis_1.google.oauth2({ version: "v2", auth: oauthClient });
};
const getAuthURL = () => {
    return oauthClient.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
    });
};
exports.getAuthURL = getAuthURL;
const getToken = async (code) => {
    try {
        const { tokens } = await oauthClient.getToken(code);
        return tokens;
    }
    catch (err) {
        throw err;
    }
};
exports.getToken = getToken;
const getUserInfo = async (token) => {
    const user = getUser(token);
    const res = await user.userinfo.get();
    return res.data;
};
exports.getUserInfo = getUserInfo;
const getCalendars = async (token, id) => {
    const calendar = getCalendar(token);
    const res = id
        ? await calendar.calendars.get({ calendarId: id })
        : await calendar.calendarList.list();
    return res.data;
};
exports.getCalendars = getCalendars;
const getColors = async (token) => {
    const res = await getCalendar(token).colors.get();
    return res.data;
};
exports.getColors = getColors;
const getEvents = async (token, calID, options = {
    timeMin: luxon_1.DateTime.local(luxon_1.DateTime.local().year).toISO(),
}) => {
    const calendar = getCalendar(token);
    const res = await calendar.events.list({ calendarId: calID, ...options });
    return res.data;
};
exports.getEvents = getEvents;
const addEvent = async (token, calID, data) => {
    const calendar = getCalendar(token);
    const res = await calendar.events.insert({
        calendarId: calID,
        requestBody: data,
    });
    return res;
};
exports.addEvent = addEvent;
