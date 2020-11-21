import express from "express";
import EventType from "../@types/event";
import * as jwt from "../middlewares/jwt";
import * as google from "../google";
import { calendar_v3 } from "googleapis";

const router = express.Router();

router.get("/", jwt.verifyToken, async (req, res) => {
    const cal: calendar_v3.Schema$CalendarList = await google.getCalendars(
        req.token,
        req.query.id
    );

    let items = cal.items.filter(
        (item) => item.accessRole.toLowerCase() === "owner"
    );

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

    let items =
        Object.keys(options).length > 0
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

router.post(
    "/events/:id",
    jwt.verifyToken,
    express.json(),
    async (req, res) => {
        if (!req.params.id) {
            // error
            throw Error;
        }
        console.log(req.body);
        const data = await google.addEvent(req.token, req.params.id, req.body);
    }
);

module.exports = router;
