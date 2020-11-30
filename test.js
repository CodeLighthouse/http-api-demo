const stackTraceParser = require('stacktrace-parser');
const CLH = require('./services/codelighthouse.service');

const CodeLighthouse = new CLH.CodeLighthouse(
    'Secret Corp',
    process.env['CODELIGHTHOUSE_SECRET'],
    resource_group="Web Apps",
    resource_name="Example App",

);

console.log(process.env['CODELIGHTHOUSE_SECRET']);

function test(a, b) {
    try {
        x = 1;
        x.push(2);
    }
    catch (err) {
        CodeLighthouse.error(err, 'kmistele@protonmail.com');

    }
}

test(1, 2);
