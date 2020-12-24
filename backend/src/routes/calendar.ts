import express from "express";
import * as jwt from "../middlewares/jwt";
import * as google from "../google";
import { calendar_v3 } from "googleapis";
import { CalendarModel, CalendarEventModel } from "../../../models/main";

const calendarRouter = express.Router();

calendarRouter.get("/", jwt.verifyToken, async (req, res) => {
    const cal: calendar_v3.Schema$CalendarList = await google.getCalendars(
        req.token as string,
        req.query.id as string
    );

    let items = cal.items!.filter(
        (item) =>
            !!item.accessRole && item.accessRole!.toLowerCase() === "owner"
    );

    const colors = await google.getColors(req.token as string);

    let cals: CalendarModel[] = items.map(
        (item) => new CalendarModel(item, colors)
    );

    res.json(cals);
});

calendarRouter.get("/events/:id", jwt.verifyToken, async (req, res) => {
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
            ? await google.getEvents(
                  req.token as string,
                  req.params.id,
                  options
              )
            : await google.getEvents(req.token as string, req.params.id);

    // const colors = await google.getColors(req.token);

    let events: CalendarEventModel[] = items
        .items!.filter((item) => item.summary && item.start && item.end)
        .map((item) => {
            let e = CalendarEventModel.fromGoogle(item);
            e.calID = req.params.id;
            return e;
        });

    res.json(events);
});

calendarRouter.post(
    "/events/:id",
    jwt.verifyToken,
    express.json(),
    async (req, res) => {
        if (!req.params.id) {
            // error
            throw Error;
        }
        const data = await google.addEvent(
            req.token as string,
            req.params.id,
            req.body
        );

        if (data.status < 400) {
            return res
                .status(data.status)
                .json(CalendarEventModel.fromGoogle(data.data));
        } else {
            // error
        }
    }
);

export default calendarRouter;
