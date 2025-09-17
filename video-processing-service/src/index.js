"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/process-video", function (req, res) {
    var inputFilePath = req.body.inputFilePath;
    var outputFilePath = req.body.outputFilePath;
    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("Bad Request: Missing file path.");
    }
    (0, fluent_ffmpeg_1.default)(inputFilePath)
        .outputOptions("-vf", "scale=-1:360")
        .on("end", function () {
        res.status(200).send("Processing finished successfully.");
    })
        .on("error", function (err) {
        console.log('An error occurred: ${err.message}');
        res.status(500).send('Internal Server Error: ${err.message}');
    })
        .save(outputFilePath);
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Video service is listening at http://localhost:".concat(port));
    console.log("Video processing service is listening at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map