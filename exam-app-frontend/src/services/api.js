import axios from "axios";

const API_URL = "https://exam-app-043c.onrender.com/api";

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Exam Submission API
export const submitExam = async (userId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/exam/submit`, { userId, answers });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fetch User Data API (for Dashboard)
export const fetchUserData = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
