import config from '../config/config';

const BASE_URL = config.baseURL;

const endpoints = {
    login: `${BASE_URL}/api/v1/auth/login/`,
    logout: `${BASE_URL}/api/v1/auth/logout/`,
    tokenRefresh: `${BASE_URL}/api/v1/auth/token/refresh/`,
    users: `${BASE_URL}/api/v1/users/`,
    userById: (id: string | number) => `${BASE_URL}/api/v1/users/${id}/`,
    userBulkDelete: `${BASE_URL}/api/v1/users/bulk-delete/`,
    // userToggle: `${BASE_URL}/api/v1/users/${id}/toggle/`,
    signup: `${BASE_URL}/api/v1/auth/register`,
    extensions: `${BASE_URL}/api/v1/extensions`,
    announcement: `${BASE_URL}/api/v1/announcements`,
    ivr: `${BASE_URL}/api/v1/ivrs`,
    trunk: `${BASE_URL}/api/v1/trunks`,
    departments: `${BASE_URL}/api/v1/departments/`,
    departmentById: (id: string | number) => `${BASE_URL}/api/v1/departments/${id}/`,
    departmentBulkDelete: `${BASE_URL}/api/v1/departments/bulk-delete/`,
    departmentToggle: (id: string | number) => `${BASE_URL}/api/v1/departments/${id}/toggle/`,
    departmentSimple: `${BASE_URL}/api/v1/departments/simple/`,
    queue: `${BASE_URL}/api/v1/queues/`,
    queueMember: `${BASE_URL}/api/v1/queue-members/`,
    music_on_hold: `${BASE_URL}/api/v1/music-on-hold/`,
    routes: `${BASE_URL}/api/v1/routes/`,
    menus: `${BASE_URL}/api/v1/menu-items/navigation/`,
    agent: `${BASE_URL}/api/v1/agents/`,
    skills: `${BASE_URL}/api/v1/skills/`,
    campaign: `${BASE_URL}/api/v1/campaigns/`,
    roles: `${BASE_URL}/api/v1/roles/`,
};

export default endpoints;