const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("anchangal", {
    version: "1.0.0"
});