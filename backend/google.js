const { google } = require("googleapis");
const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");
const SCOPE = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.profile",
];

const credentials = JSON.parse(fs.readFileSync("credentials.json")).web;

const { client_secret, client_id, redirect_uris } = credentials;
const oauthClient = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris
);

const setCredentials = (token) => {
    const { access, refresh, scope, type, id, expiry, iat } = token;

    if (!access || !refresh || !scope || !type || !id || !expiry || !iat) {
        // error
    }

    oauthClient.setCredentials(token);
};

const getCalendar = (token) => {
    setCredentials(token);
    return google.calendar({ version: "v3", auth: oauthClient });
};

const getUser = (token) => {
    setCredentials(token);
    return google.oauth2({ version: "v2", auth: oauthClient });
};

const getAuthURL = () => {
    return oauthClient.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
    });
};

const getToken = async (code) => {
    try {
        const { tokens } = await oauthClient.getToken(code);
        return tokens;
    } catch (err) {
        throw err;
    }
};

const getUserInfo = async (token) => {
    const user = getUser(token);
    const res = await user.userinfo.get();
    return res.data;
};

const getCalendars = async (token, id) => {
    const calendar = getCalendar(token);
    const res = id
        ? await calendar.calendars.get({ calendarId: id })
        : await calendar.calendarList.list();

    return res.data;
};

const getColors = async (token) => {
    const res = await getCalendar(token).colors.get();
    return res.data;
};

const getEvents = async (
    token,
    calID,
    options = {
        timeMin: DateTime.local(DateTime.local().year).toISO(),
    }
) => {
    const calendar = getCalendar(token);
    const res = await calendar.events.list({ calendarId: calID, ...options });

    return res.data;
};

const addEvent = async (token, calID, data) => {
    const calendar = getCalendar(token);
    const res = await calendar.events.insert({
        calendarId: calID,
        requestBody: data,
    });
    return res;
};

module.exports = {
    getAuthURL,
    getCalendars,
    getToken,
    getUserInfo,
    getEvents,
    getColors,
    addEvent,
};
