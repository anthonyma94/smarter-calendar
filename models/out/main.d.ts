import { calendar_v3 } from "googleapis/build/src/apis/calendar/index";
import { DateTime } from "luxon";
import { EventInput as FullCalendarEvent } from "@fullcalendar/react";
export declare class CalendarModel {
    id: string;
    summary: string;
    timeZone: string;
    color?: calendar_v3.Schema$ColorDefinition;
    constructor(cal: calendar_v3.Schema$CalendarListEntry, colors: calendar_v3.Schema$Colors);
}
export declare class CalendarEventModel {
    id: string;
    calID?: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
    textColor?: string;
    private constructor();
    static fromGoogle(event: calendar_v3.Schema$Event): CalendarEventModel;
    static fromFullCalendar(event: FullCalendarEvent): CalendarEventModel;
    static fromDateTime(start: DateTime, end: DateTime): CalendarEventModel;
    toGoogle: () => calendar_v3.Schema$Event;
}
