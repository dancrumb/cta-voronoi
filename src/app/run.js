require({
    baseUrl: '',

    packages: [
        'dojo',
        'dijit',
        'dojox',
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
        // For reference, this is what a more verbose package declaration looks like.
        { name: 'app', location: 'app', map: {} }
    ]
// Require `app`. This loads the main application module, `app/main`, since we registered the `app` package above.
}, [ 'app' ]);