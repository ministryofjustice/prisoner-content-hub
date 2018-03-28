const production = process.env.NODE_ENV === 'production';

function get(name, fallback, options = {}) {
    if (process.env[name]) {
        return process.env[name];
    }
    if (fallback !== undefined && (!production || !options.requireInProduction)) {
        return fallback;
    }
    throw new Error('Missing env var ' + name);
}

module.exports = {
    sessionSecret: get('SESSION_SECRET', 'app-insecure-default-session', {requireInProduction: true})
};