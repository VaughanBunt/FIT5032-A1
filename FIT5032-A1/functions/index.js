/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest,  } from "firebase-functions/v2/https";
//import { onDocumentWritten } from "firebase-functions/v2/firestore";
import sendGrid from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config({ path: './sendgrid.env' });

import admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

import corsModule from "cors";
const cors = corsModule({ origin: true });

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

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

export const EmailParticipants = onRequest({ invoker: "public" }, async (req, res) =>{
    cors(req, res, async() =>{
        try{
            const id = req.query.id;
            const snapshot = await db.collection("events").doc(id).get()

            if (!snapshot.exists) {
                return res.status(404).send("Event not found");
            }

            const eventDoc = snapshot.data();

            const participants = eventDoc.attendees

            const participantsEmails = participants.map(participant => participant.email)
            if (!participantsEmails || participantsEmails.length === 0) {
                console.log("No emails found for participants.");
                return res.status(200).send("No participants to email");
            }

            const subject = `Important Update on Event: ${eventDoc.name}`;

            const textContent = `
                Hello,

                There has been an important update to the event "${eventDoc.name}":
                
                - Date: ${eventDoc.date}
                - Sport: ${eventDoc.sport}

                Please check the event details for more information.

                SportsConnect
            `;

            const emails = participantsEmails.map(email => ({
                to: email,
                from: 'vbun0002@student.monash.edu',
                subject: subject,
                text: textContent,
            }));

            await sendGrid.send(emails);

            res.status(200).send(`Emails successfully sent to ${participantsEmails.length} participants. ${emails}`);
        } catch (error) {
            console.error("Error emailing participants:", error);
            res.status(500).send("Error sending emails");
        }
    })
})

//tried to email participants when the record was updated, didn't work
/*export const EmailParticipants = onDocumentWritten("events/{docID}", async (event) =>{
    try{
        const before = event.data.before;
        const after = event.data.after;

        const dateChanged = before.date !== after.date;
        const sportChanged = before.sport !== after.sport;

        if (!dateChanged && !sportChanged){
            return;
        }

        const participants = after.attendees;
        if (!participants || participants.length === 0){
            return;
        }

        const participantsEmails = await getParticipantsEmails(participants)

        if (participantsEmails.length === 0) {
            console.log("No emails found for participants.");
            return null;
        }

        const subject = `Important Update on Event: ${after.name}`;

        const textContent = `
            Hello,

            There has been an important update to the event "${after.name}":
            
            - Date: ${after.date}
            - Sport: ${after.sport}

            Please check the event details for more information.

            SportsConnect
        `;

        const emails = participantsEmails.map(email => ({
            to: email,
            from: 'vbun0002@student.monash.edu',
            subject: subject,
            text: textContent,
        }));

        await sendGrid.send(emails);
        return;
    } catch (error) {
        console.error("Error emailing participants:", error);
        return;
    }
})

async function getParticipantsEmails(participants) {
    const participantUIDs = participants.map(participant => participant.uid);
    const userEmails = [];

    const usersRef = db.collection("users");
    const usersSnapshot = await usersRef.where("uid", "in", participantUIDs).get();

    if (usersSnapshot.empty) {
        console.log("No users found with the given UIDs.");
        return userEmails;
    }

    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.email) {
        userEmails.push(userData.email);
        }
    });

    return userEmails;
}*/


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
