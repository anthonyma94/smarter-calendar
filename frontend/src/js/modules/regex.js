// const { DateTime } = require("luxon");
import { DateTime } from "luxon";

const format = "y-M-d h:m";

// Weekday names enum
const weekDayName = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

const weekDayNameShort = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
const regex = /^(?:(?<nextWeek>next)\s+)?(?<startDay>(?:(?:mon|fri|sun)(?:day)?|(?:tue(?:s)?(?:day)?|wed(?:nesday)?|thur(?:s)?(?:sday)?|sat(?:urday)?))\b)\s*(?<startHour>(?:[1-9]|[1][0-2]))(?::(?<startMinute>(?:[0-5][0-9])))?\s*(?:(?<startHalfday>[ap])[m]?)?\s*-\s*(?<endDay>(?:(?:mon|fri|sun)(?:day)?|(?:tue(?:s)?(?:day)?|wed(?:nesday)?|thur(?:s)?(?:sday)?|sat(?:urday)?))\b)?\s*(?<endHour>[0-9]{1,2})(?::(?<endMinute>(?:[0-5][0-9])))?\s*(?:(?<endHalfday>[ap])[m]?)?$/;

const parseDay = (day) => {
    if (!day.includes("day")) {
        if (day === "tue" || day === "thur") day = day.concat("s");
        else if (day === "thu") day = day.concat("rs");
        day = weekDayName[weekDayNameShort.indexOf(day)];
    }
    return day;
};

const parseDaysUntilNext = (startDay, tz) => {
    let d = DateTime.local().setZone(tz);
    let daysFromSunday = weekDayName.indexOf(startDay);
    let daysUntilNext = daysFromSunday + ((7 - d.get("weekday")) % 7);

    // Sets and gets date in proper format
    d = d.plus({ days: daysUntilNext });
    return d.toISODate();
};

const parseEvents = (data, tz = "local") => {
    let parsedEvents = data.split(",").map((item) => {
        let regexResult = regex.exec(item.trim().toLowerCase());

        if (!regexResult)
            // Invalid regex
            return undefined;
        let startDay = parseDay(regexResult.groups.startDay.toLowerCase());

        if (!weekDayName.includes(startDay))
            // Invalid day name
            return undefined;

        let endDay;
        if (regexResult.groups.endDay) {
            endDay = parseDay(regexResult.groups.endDay.toLowerCase());

            if (!weekDayName.includes(endDay))
                // Invalid day name
                return undefined;
        }

        let startHour = Number.parseInt(regexResult.groups.startHour);
        let endHour = Number.parseInt(regexResult.groups.endHour);

        // Variables that may exist
        let startMinute = Number.parseInt(regexResult.groups.startMinute) || 0;
        let endMinute = Number.parseInt(regexResult.groups.endMinute) || 0;

        // Halfday calculations if they exist
        if (regexResult.groups.startHalfday) {
            if (
                regexResult.groups.startHalfday.toLowerCase() === "a" &&
                startHour === 12
            )
                startHour -= 12;
            else if (
                regexResult.groups.startHalfday.toLowerCase() === "p" &&
                startHour !== 12
            )
                startHour += 12;
        } else {
            if (startHour === 12) startHour -= 12;
        }

        if (regexResult.groups.endHalfday) {
            if (
                regexResult.groups.endHalfday.toLowerCase() === "a" &&
                endHour === 12
            )
                endHour -= 12;
            else if (
                regexResult.groups.endHalfday.toLowerCase() === "p" &&
                endHour !== 12
            )
                endHour += 12;
        } else {
            if (
                endHour < startHour ||
                (endHour === startHour && endMinute < startMinute)
            ) {
                endHour += 12;
            }
        }

        // Date calculation, calculates the amount of days from today till next sunday, then from sunday to inputted weekday

        let d = DateTime.local().setZone(tz);
        let daysFromSunday = weekDayName.indexOf(startDay);
        let daysUntilNext = daysFromSunday + ((7 - d.get("weekday")) % 7);

        // Sets and gets date in proper format
        d = d.plus({ days: daysUntilNext });
        let date = parseDaysUntilNext(startDay, tz);

        let endDate;
        if (endDay) {
            endDate = parseDaysUntilNext(endDay, tz);
        }

        // Using Luxon
        let startTime = DateTime.fromFormat(
            `${date} ${startHour}:${startMinute}`,
            format,
            { zone: tz }
        );
        let endTime = DateTime.fromFormat(
            `${endDate || date} ${endHour}:${endMinute}`,
            format,
            { zone: tz }
        );

        if (startTime >= endTime) {
            if (endDate) {
                endTime = endTime.plus({ days: 7 });
            } else if (!endDate && regexResult.groups.endHalfday) {
                endTime = endTime.plus({ days: 1 });
            } else {
                endTime = endTime.plus({ hours: 12 });
            }
        }

        // Check if user inputted for next week
        if (regexResult.groups.nextWeek) {
            startTime = startTime.plus({ days: 7 });
            endTime = endTime.plus({ days: 7 });
        }

        let event = { startTime, endTime };
        return event;
    });

    parsedEvents = parsedEvents.filter((item) => item);

    // Check that events come after the previous event

    if (parsedEvents.length > 1) {
        for (let i = 1; i < parsedEvents.length; i++) {
            if (parsedEvents[i].startTime < parsedEvents[i - 1].startTime) {
                parsedEvents[i] = {
                    startTime: parsedEvents[i].startTime.plus({ days: 7 }),
                    endTime: parsedEvents[i].endTime.plus({ days: 7 }),
                };
            }
        }
    }

    return parsedEvents;
};

export default parseEvents;
