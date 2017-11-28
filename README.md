# envproxy
Uses ecma 2015 Proxy to store configuration in environment variables with automatic verification. If a test/stage/prod environment has not been configured correctly, the app will fail on startup immediately telling the installer that they need to make sure the environment variables are set.

Because it uses the ECMA2015 Proxy object, it throws an error if you try and access a property in the environment that was not specified. This enables the developer to be confidence that all their possible environment variables are specified in one place.


## Example

// example.js

    const EnvProxy = require('envproxy');
    
    try {
      const env = new EnvProxy({
        MONGO: 'mongodb://localhost/myapp',
        SMTP: { required: true, value: 'smtp://localhost:1025' },
      });

      console.log('MONGO: ', env.MONGO);
      console.log('SMTP: ', env.SMTP);
      console.log('DEBUG: ', env.DEBUG); // Error
    } catch(err) {
      console.error(err);
    }

Example running in (NODE_ENV === undefined || NODE_ENV === development || NODE_ENV===dev)

    $ MONGO=localhost node example.js
    MONGO:  localhost
    SMTP:  smtp://localhost:1025
    Error: "DEBUG" not found in environment.
        at Object.get (/Users/jason/Documents/git/envproxy/envproxy.js:47:11)
        at Object.<anonymous> (/Users/jason/Documents/git/envproxy/example.js:13:30)
        at Module._compile (module.js:641:30)
        at Object.Module._extensions..js (module.js:652:10)
        at Module.load (module.js:560:32)
        at tryModuleLoad (module.js:503:12)
        at Function.Module._load (module.js:495:3)
        at Function.Module.runMain (module.js:682:10)
        at startup (bootstrap_node.js:191:16)
        at bootstrap_node.js:613:3


Example running in !(NODE_ENV === undefined || NODE_ENV === development || NODE_ENV===dev)

    $ NODE_ENV=test node example.js
    { Error: Required environment variables missing
        at new EnvProxy (/Users/jason/Documents/git/envproxy/envproxy.js:73:13)
        at Object.<anonymous> (/Users/jason/Documents/git/envproxy/example.js:6:15)
        at Module._compile (module.js:641:30)
        at Object.Module._extensions..js (module.js:652:10)
        at Module.load (module.js:560:32)
        at tryModuleLoad (module.js:503:12)
        at Function.Module._load (module.js:495:3)
        at Function.Module.runMain (module.js:682:10)
        at startup (bootstrap_node.js:191:16)
        at bootstrap_node.js:613:3
      variables: 
       [ { required: true, value: 'smtp://localhost:1025', name: 'SMTP' } ] }

