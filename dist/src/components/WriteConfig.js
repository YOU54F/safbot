"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const react_2 = require("@boost/cli/react");
function WriteConfig({ data, path }) {
    const { exit } = (0, react_2.useProgram)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        fs_1.default.promises
            .writeFile(path, JSON.stringify(data), 'utf8')
            .then(() => {
            setLoading(false);
        })
            .catch((error) => {
            exit(error);
        });
    }, [path]);
    if (loading) {
        return (react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, null, "Writing config file...")));
    }
    return (react_1.default.createElement(ink_1.Box, null,
        react_1.default.createElement(ink_1.Text, null,
            "Wrote config to file",
            ' ',
            react_1.default.createElement(react_2.Style, { type: "success", children: '' }, path))));
}
exports.default = WriteConfig;
