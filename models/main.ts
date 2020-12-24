import { calendar_v3 } from "googleapis/build/src/apis/calendar/index";
import { DateTime } from "luxon";
import { EventInput as FullCalendarEvent } from "@fullcalendar/react";

export class CalendarModel {
    public id: string;
    public summary: string;
    public timeZone: string;
    public color?: calendar_v3.Schema$ColorDefinition;

    constructor(
        cal: calendar_v3.Schema$CalendarListEntry,
        colors: calendar_v3.Schema$Colors
    ) {
        this.id = cal.id as string;
        this.summary = cal.summary as string;
        this.timeZone = cal.timeZone ?? "";
        this.color = colors.calendar![cal.colorId!];
    }
}

export class CalendarEventModel {
    public id: string;
    public calID?: string;
    public title: string;
    public start: string;
    public end: string;
    public backgroundColor?: string;
    public textColor?: string;

    private constructor() {
        this.id = "";
        this.title = "";
        this.start = "";
        this.end = "";
    }

    public static fromGoogle(
        event: calendar_v3.Schema$Event
    ): CalendarEventModel {
        let item = new CalendarEventModel();
        item.id = event.id as string;
        item.title = event.summary as string;
        item.start = event.start?.dateTime! || event.start!.date!;
        item.end = event.end?.dateTime! || event.end!.date!;
        return item;
    }

    public static fromFullCalendar(
        event: FullCalendarEvent
    ): CalendarEventModel {
        let item = new CalendarEventModel();
        item.id = event.id as string;
        item.title = event.title as string;
        item.start = event.start as string;
        item.end = event.end as string;
        return item;
    }

    public static fromDateTime(
        start: DateTime,
        end: DateTime
    ): CalendarEventModel {
        let item = new CalendarEventModel();
        item.start = start.toISO();
        item.end = end.toISO();
        return item;
    }

    public toGoogle = (): calendar_v3.Schema$Event => {
        return {
            id: this.id,
            summary: this.title,
            start: {
                dateTime: this.start,
            },
            end: {
                dateTime: this.end,
            },
        };
    };
}
