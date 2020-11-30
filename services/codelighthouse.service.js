const axios = require('axios');
const stackTraceParser = require('stacktrace-parser');

class CodeLighthouse {

    // CONSTRUCTOR
    constructor(organization_name, api_key, resource_group = null, resource_name, dev= false) {

        // GET PROPERTIES
        this.resource_group = resource_group;
        this.resource_name = resource_name;

        // DETERMINE URL
        let url;
        if (dev) {
            url = 'https://dev.codelighthouse.io/v1';
        }
        else {
            url = 'https://codelighthouse.io/v1';
        }

        // CREATE AXIOS INSTANCE
        this.httpClient = axios.create({
            baseURL: url,
            headers: {
                'User-Agent': 'CodeLighthouse',     // IMPORTANT!
                'Content-Type': 'application/json', // OPTIONAL
                'organization': organization_name,  // YOUR ORGANIZATION NAME FROM THE ADMIN PANEL
                'x-api-key': api_key                // API KEY, THIS SHOULD FROM AN ENVIRONMENT VARIABLE; ALSO FROM ADMIN PANEL
            }
        });
    }

    // FUNCTION TO HANDLE AN ERROR
    error(err, email) {

        // POST BODY DATA
        const data = {}

        // ADD STUFF FROM THE ERROR,
        data.title = err.name;
        data.description = err.message;

        // ADD RESOURCE GROUP AND NAME IF SPECIFIED
        if (this.resource_group) data.resource_group = this.resource_group;
        if (this.resource_name) data.resource_name = this.resource_name;

        // ADD EMAIL, THIS IS REQUIRED
        data.email = email;

        // ADD THE STACK TRACE
        const formatted_trace = [];
        const parsed_stack_trace = stackTraceParser.parse(err.stack);
        for (let trace of parsed_stack_trace) {
            formatted_trace.push({
                'file': trace.file,
                'line': '',        // NOT AVAILABLE IN JAVASCRIPT
                'lineno': trace.lineNumber,
                'function': trace.methodName
            })
        }
        data.stack_trace = formatted_trace;

        // ADD METHOD NAME AND ARGUMENTS OF TOP-LEVEL ERROR
        data['arguments'] = parsed_stack_trace[0].arguments;    // ARGUMENTS IS A RESERVED WORD SO DO IT THIS WAY
        data['function'] = parsed_stack_trace[0].methodName;

        console.log(data);

        this.httpClient.post('/error', data)
            .then(response => {
                console.log(response.data)
            })

    }
}

module.exports = {
    CodeLighthouse
};