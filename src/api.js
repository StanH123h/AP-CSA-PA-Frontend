import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.5:8080/api',

    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors can be added here for handling auth tokens, etc.

// --- Authentication Endpoints ---

/**
 * Student Login
 * @param {string} username
 * @param {string} password
 * @returns {Promise<any>}
 */
export const login = (username, password) => {
    return apiClient.post('/login', { username, password });
};

// --- Client Endpoints (Student & Public) ---

/**
 * Get all available teachers
 * @returns {Promise<any>}
 */
export const getAllTeachers = () => {
    return apiClient.get('/teachers');
};

/**
 * Submit student choices
 * @param {object} choiceData - { studentId: number, teacherVotes: { teacherId: number, votes: number }[] }
 * @returns {Promise<any>}
 */
export const submitStudentChoices = (choiceData) => {
    return apiClient.post('/student/choices', choiceData);
};

/**
 * Get student's choices for the current session
 * @param {number} studentId
 * @returns {Promise<any>}
 */
export const getStudentChoices = (studentId) => {
    return apiClient.get(`/student/${studentId}/choices`);
};

/**
 * Get student's match result for the current session
 * @param {number} studentId
 * @returns {Promise<any>}
 */
export const getStudentMatchResult = (studentId) => {
    return apiClient.get(`/student/${studentId}/match/result`);
};

/**
 * Get the current active selection session
 * @returns {Promise<any>}
 */
export const getCurrentActiveSession = () => {
    return apiClient.get('/sessions/current');
};

export default apiClient;
