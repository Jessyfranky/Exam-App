import axios from "axios";

const API_URL = "https://exam-app-5gw3.onrender.comhttps://exam-app-5gw3.onrender.com/api";

export const registerUser = async (name, email, password, role, adminCode) => {
  try {
    const payload = { name, email, password, role };
    if (role === "admin") {
      payload.adminCode = adminCode; // Include adminCode if role is admin.
    }
    const response = await axios.post(`${API_URL}/auth/register`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

  export const loginUser = async (email, password, role, adminCode) => {
    try {
      const payload = { email, password, role };
      if (role === "admin") {
        payload.adminCode = adminCode;
      }
      const response = await axios.post(`${API_URL}/auth/login`, payload);
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
