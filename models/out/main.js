"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEventModel = exports.CalendarModel = void 0;
var CalendarModel = /** @class */ (function () {
    function CalendarModel(cal, colors) {
        var _a;
        this.id = cal.id;
        this.summary = cal.summary;
        this.timeZone = (_a = cal.timeZone) !== null && _a !== void 0 ? _a : "";
        this.color = colors.calendar[cal.colorId];
    }
    return CalendarModel;
}());
exports.CalendarModel = CalendarModel;
var CalendarEventModel = /** @class */ (function () {
    function CalendarEventModel() {
        var _this = this;
        this.toGoogle = function () {
            return {
                id: _this.id,
                summary: _this.title,
                start: {
                    dateTime: _this.start,
                },
                end: {
                    dateTime: _this.end,
                },
            };
        };
        this.id = "";
        this.title = "";
        this.start = "";
        this.end = "";
    }
    CalendarEventModel.fromGoogle = function (event) {
        var _a, _b;
        var item = new CalendarEventModel();
        item.id = event.id;
        item.title = event.summary;
        item.start = ((_a = event.start) === null || _a === void 0 ? void 0 : _a.dateTime) || event.start.date;
        item.end = ((_b = event.end) === null || _b === void 0 ? void 0 : _b.dateTime) || event.end.date;
        return item;
    };
    CalendarEventModel.fromFullCalendar = function (event) {
        var item = new CalendarEventModel();
        item.id = event.id;
        item.title = event.title;
        item.start = event.start;
        item.end = event.end;
        return item;
    };
    CalendarEventModel.fromDateTime = function (start, end) {
        var item = new CalendarEventModel();
        item.start = start.toISO();
        item.end = end.toISO();
        return item;
    };
    return CalendarEventModel;
}());
exports.CalendarEventModel = CalendarEventModel;
