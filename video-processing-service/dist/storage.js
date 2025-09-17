"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDirectories = setupDirectories;
exports.convertVideo = convertVideo;
exports.downloadRawVideo = downloadRawVideo;
exports.uploadProcessedVideo = uploadProcessedVideo;
const storage_1 = require("@google-cloud/storage");
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const storage = new storage_1.Storage();
const rawVideoBucketName = "sanjana-yt-raw-videos";
const processedVideoBucketName = "sanjana-yt-processed-videos";
const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";
function setupDirectories() {
}
function convertVideo(rawVideoName, processedVideoName) {
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)('${localRawVideoPath}/${rawVideoName}')
            .outputOptions("-vf", "scale=-1:360")
            .on("end", () => {
            console.log("Processing finished successfully.");
            resolve();
        })
            .on("error", (err) => {
            console.log('An error occurred: ${err.message}');
            reject(err);
        })
            .save('${localProcessedVideoPath}/${processedVideoName}');
    });
}
async function downloadRawVideo(fileName) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: '${localRawVideoPath}/${fileName}' });
    console.log('gs://{rawVideoBucketName}/{fileName} downloaded to ${localRawVideoPath}/${fileName}.');
}
async function uploadProcessedVideo(fileName) {
    const bucket = storage.bucket(processedVideoBucketName);
    await bucket.upload('${localProcessedVideoPath}/${fileName}', {
        destination: fileName
    });
    console.log('${localProcessedVideoPath}/${fileName} uploaded to gs://{processedVideoBucketName}/{fileName}.');
    await bucket.file(fileName).makePublic();
}
function deleteLocalFile(filePath) {
    return new Promise((resolve, reject) => {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.log('Failed to delete file at ${filePath}', err);
                    reject(err);
                }
                else {
                    console.log('File deleted at ${filePath}');
                    resolve();
                }
            });
        }
        else {
            console.log('File not found at ${filePath}, skipping the delete.');
            resolve();
        }
    });
}
function ensureDirectoryExists(dirPath) {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created at ${dirPath}`);
    }
}
//# sourceMappingURL=storage.js.map