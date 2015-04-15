require({
    baseUrl: 'js',

    packages: [
        'dojo',
        'dijit',
        'amd',
        {
            name: 'lodash',
            location: 'lodash',
            main: 'lodash.min'
        },
        {
            name: 'd3',
            location: 'd3',
            main: 'd3.min'
        },
        'app'
    ]   
// Require `app`. This loads the main application module, `app/main`, since we registered the `app` package above.
}, [ 'app' ]);