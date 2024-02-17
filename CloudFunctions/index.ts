import notificationTriggers = require("./src/triggers/notificationTriggers");
exports.notifications = notificationTriggers;

import userIntegrityTriggers = require("./src/triggers/integrityTriggers/userTriggers");
exports.userIntegrity = userIntegrityTriggers;

import societyIntegrityTriggers = require("./src/triggers/integrityTriggers/societyTriggers");
exports.societyIntegrity = societyIntegrityTriggers;

import eventIntegrityTriggers = require("./src/triggers/integrityTriggers/eventTriggers");
exports.eventIntegrity = eventIntegrityTriggers;
