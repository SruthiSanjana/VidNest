import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({credential : credential.applicationDefault()});

const firestore = new Firestore();

// Note: This requires setting the env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
    firestore.settings({
        host: "localhost:8080",
        ssl: false
    });
} */

const VideosCollection = "videos";

export interface Video {
    id?: string,
    uid?: string,
    fileName?: string,
    status?: 'processing' | 'processed' ,
    title?: string,
    description?: string
}