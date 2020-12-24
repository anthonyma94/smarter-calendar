"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var jwt = __importStar(require("../middlewares/jwt"));
var google = __importStar(require("../google"));
var main_1 = require("../../../models/main");
var calendarRouter = express_1.default.Router();
calendarRouter.get("/", jwt.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cal, items, colors, cals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, google.getCalendars(req.token, req.query.id)];
            case 1:
                cal = _a.sent();
                items = cal.items.filter(function (item) {
                    return !!item.accessRole && item.accessRole.toLowerCase() === "owner";
                });
                return [4, google.getColors(req.token)];
            case 2:
                colors = _a.sent();
                cals = items.map(function (item) { return new main_1.CalendarModel(item, colors); });
                res.json(cals);
                return [2];
        }
    });
}); });
calendarRouter.get("/events/:id", jwt.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var options, items, _a, events;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                options = {};
                if (req.query.start) {
                    options = __assign(__assign({}, options), { timeMin: req.query.start });
                }
                if (req.query.end) {
                    options = __assign(__assign({}, options), { timeMax: req.query.end });
                }
                if (!(Object.keys(options).length > 0)) return [3, 2];
                return [4, google.getEvents(req.token, req.params.id, options)];
            case 1:
                _a = _b.sent();
                return [3, 4];
            case 2: return [4, google.getEvents(req.token, req.params.id)];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                items = _a;
                events = items
                    .items.filter(function (item) { return item.summary && item.start && item.end; })
                    .map(function (item) {
                    var e = main_1.CalendarEventModel.fromGoogle(item);
                    e.calID = req.params.id;
                    return e;
                });
                res.json(events);
                return [2];
        }
    });
}); });
calendarRouter.post("/events/:id", jwt.verifyToken, express_1.default.json(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.params.id) {
                    throw Error;
                }
                return [4, google.addEvent(req.token, req.params.id, req.body)];
            case 1:
                data = _a.sent();
                if (data.status < 400) {
                    return [2, res
                            .status(data.status)
                            .json(main_1.CalendarEventModel.fromGoogle(data.data))];
                }
                else {
                }
                return [2];
        }
    });
}); });
exports.default = calendarRouter;
