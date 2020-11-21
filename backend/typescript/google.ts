import { calendar_v3, google } from "googleapis";
import { DateTime } from "luxon";
import fs from "fs";
const SCOPE = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.profile",
];

const credentials = JSON.parse(fs.readFileSync("credentials.json").toString())
    .web;

const { client_secret, client_id, redirect_uris } = credentials;
const oauthClient = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris
);

interface Token {
    access: string;
    refresh: string;
    scope: string;
    type: string;
    id: string;
    expiry: string;
    iat: string;
}

const setCredentials = (token: Token) => {
    const { access, refresh, scope, type, id, expiry, iat } = token;

    if (!access || !refresh || !scope || !type || !id || !expiry || !iat) {
        // error
    }

    oauthClient.setCredentials(token);
};

const getCalendar = (token: Token) => {
    setCredentials(token);
    return google.calendar({ version: "v3", auth: oauthClient });
};

const getUser = (token: Token) => {
    setCredentials(token);
    return google.oauth2({ version: "v2", auth: oauthClient });
};

export const getAuthURL = () => {
    return oauthClient.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
    });
};

export const getToken = async (code: string) => {
    try {
        const { tokens } = await oauthClient.getToken(code);
        return tokens;
    } catch (err) {
        throw err;
    }
};

export const getUserInfo = async (token: Token) => {
    const user = getUser(token);
    const res = await user.userinfo.get();
    return res.data;
};

export const getCalendars = async (token: Token, id?: string) => {
    const calendar = getCalendar(token);
    const res = id
        ? await calendar.calendars.get({ calendarId: id })
        : await calendar.calendarList.list();

    return res.data;
};

export const getColors = async (token: Token) => {
    const res = await getCalendar(token).colors.get();
    return res.data;
};

export const getEvents = async (
    token: Token,
    calID: string,
    options: object = {
        timeMin: DateTime.local(DateTime.local().year).toISO(),
    }
) => {
    const calendar = getCalendar(token);
    const res = await calendar.events.list({ calendarId: calID, ...options });

    return res.data;
};

export const addEvent = async (token: Token, calID: string, data: any) => {
    const calendar = getCalendar(token);
    const res = await calendar.events.insert({
        calendarId: calID,
        requestBody: data,
    });
    return res;
};
