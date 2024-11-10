// // src/consoleOverrides.js

// (function () {
//     const originalConsoleError = console.error;

//     console.error = function (message, ...args) {
//         if (message && typeof message === 'string' && message.includes('SSL routines:ssl3_get_record:wrong version number')) {
//             // Filter out specific SSL/TLS error messages
//             return;
//         }
//         // Call original console.error for other messages
//         originalConsoleError.apply(console, [message, ...args]);
//     };
// })();
