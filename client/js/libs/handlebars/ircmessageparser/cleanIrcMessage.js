"use strict";

// TODO: This does not strip hex based colours - issue #1413
module.exports = (message) => message.replace(/\x02|\x1D|\x1F|\x16|\x0F|\x03(?:[0-9]{1,2}(?:,[0-9]{1,2})?)?/g, "").trim();
