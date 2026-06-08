import config from '../config/config';

const BASE_URL = config.baseURL;

const endpoints = {
    login: `${BASE_URL}/api/v1/auth/login/`,
    signup: `${BASE_URL}/api/v1/auth/register`,
    extensions: `${BASE_URL}/api/v1/extensions`,
    announcement: `${BASE_URL}/api/v1/announcements`,
    ivr: `${BASE_URL}/api/v1/ivrs`,
    trunk: `${BASE_URL}/api/v1/trunks`,
    queue: `${BASE_URL}/api/v1/queues`,
    music_on_hold: `${BASE_URL}/api/v1/music-on-hold`,
    routes: `${BASE_URL}/api/v1/routes`,
};

export default endpoints;