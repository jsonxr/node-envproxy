
class EnvError extends Error {
  constructor(message, variables) {
    super(message);
    if (variables) {
      this.variables = variables;
    }
  }
}

function parseBool(value) {
  if (value === undefined) { return false; }
  const str = value.toString().toLowerCase();
  return ('true' === str || 'yes' === str);
}

function fromString(type, defaultValue, str) {
  if (type === 'number') {
    return parseFloat(str)
  } else if (type === 'boolean') {
    return parseBool(str);
  } else if( Object.prototype.toString.call(defaultValue) === '[object Array]' ) {
    // Array
    const arr = str.split(',');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
    }
    return arr;
  } else {
    return str;
  }
}

const handler = {
  get(target, name) {
    if (target.hasOwnProperty(name)) {
      const prop = target[name];
      const defaultValue = prop.default;
      const type = typeof defaultValue;

      if (process.env[name] !== undefined) {
        return fromString(type, defaultValue, process.env[name]);
      } else {
        return defaultValue;
      }
    }
    throw new EnvError(`"${name}" not found in environment.`);
  }
};

function EnvProxy(defaults) {
  // Normalize the defaults data
  Object.keys(defaults).forEach((key) => {
    const prop = defaults[key];
    if (typeof prop !== 'object') {
      defaults[key] = {
        required: false,
        default: prop,
      }
    }
    defaults[key].name = key;
  });

  // Verify that variables that are required are in process.env
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = (env === 'development' || env === 'dev');
  if (! isDevelopment) {
    const required = [];
    Object.keys(defaults).forEach((key) => {
      const prop = defaults[key];
      if (prop.required && !process.env[key]) {
        required.push(prop);
      }
    });
    if (required.length > 0) {
      throw new EnvError('Required environment variables missing', required);
    }
  }

  // Add values to process.env if they do not exist so other libraries can use
  Object.keys(defaults).forEach((key) => {
    const prop = defaults[key];
    if (! process.env[key]) {
      process.env[key] = defaults[key].default;
    }
  });

  return new Proxy(defaults, handler);
}

module.exports = EnvProxy;
