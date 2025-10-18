/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

import admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

import corsModule from "cors";
const cors = corsModule({ origin: true });

export const CountEvents = onRequest((req, res) =>{
    cors(req, res, async () =>{
        try {
            const uid = req.query.uid;
            let query = db.collection("events");

            if (uid) {
                query = query.where("owner.uid", "==", uid);
            }
            const snapshot = await query.get();

            const count = snapshot.size;

            res.status(200).json({ count });
        } catch (error) {
            console.error("Error counting events: ", error.message);
            res.status(500).send("Error counting events");
        }
    })
})



// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
