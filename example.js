// env.js
//const EnvProxy = require('envproxy');
const EnvProxy = require('./envproxy.js');

try {
  const env = new EnvProxy({
    MONGO: 'mongodb://localhost/myapp',
    SMTP: { required: true, default: 'smtp://localhost:1025' },
  });

  console.log('MONGO: ', env.MONGO);
  console.log('SMTP: ', env.SMTP);
  console.log('DEBUG: ', env.DEBUG); // Error
} catch(err) {
  console.error(err);
}
