
import axios from 'axios';
// Centralized API base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'
console.log(API_BASE_URL)
const token = localStorage.getItem('token') || "";
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
const userId = sessionStorage.getItem("userId");

// ========== Auth APIs ==========

// Get all knowledge bases
export const LoginWithEmailOTP = async (email) => {
  const res = await api.post('/auth/LoginWithEmailOTP', { email });
  return res;
};

export const verifyEmailOTP = async (email, otp) => {
  const customerRes = await fetch(`${API_BASE_URL}/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const customerData = await customerRes.json();
  let customerId = customerData.customerId;
  const res = await api.post('/auth/verifyEmailOTP', { email, otp, customerId });
  return res;
};

export const verifyOrCreateUser = async (email, otp) => {

   const res1 = await api.post('/auth/LoginWithEmailOTP', { email });

  const customerRes = await fetch(`${API_BASE_URL}/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const customerData = await customerRes.json();
  let customerId = customerData.customerId;
  const res = await api.post('/auth/verifyEmailOTP', { email, otp, customerId });
  return { res1, res };
};

export const getRetellVoices = async () => {
  const res = await axios.get('https://api.retellai.com/list-voices', {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
    },
  });
  return res;
};

export const createAgent = async (data) => {
  const res = await api.post('/agent/createAgent', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const fetchDashboardDetails = async (userId) => {
  const res = await api.get(`${API_BASE_URL}/agent/getUserAgentsDetails/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchAgentDetailById = async (data) => {
  const res = await api.post('/agent/fetchAgentDetailsById', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data;
}
export const getAgentById = async (id) => {
  const res = await api.get(`/agent/getAgentById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data;
}

export const EndWebCallUpdateAgentMinutesLeft = async (data) => {
  const res = await api.patch(`/agent/updateAgentMinutesLeft`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res;
}
export const SendScriptToDeveloper = async (data) => {
  const res = await api.post(`/agent/sendScriptToEmail`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res;
}
export const listAgents = async () => {
  const res = await api.get(`${API_BASE_URL}/agent/listAgents`, {
  });
  return res.data;
}

export const countAgentsbyUserId = async (userId) => {
  try {
    const res = await api.get(`${API_BASE_URL}/agent/listAgents?userId=${userId}`);
    return res.data.length || 0;
  } catch (error) {
    console.error("Error fetching agent count:", error);
    return 0;
  }
};

export const updateProfilePicture = async (userId, data) => {
  const res = await api.patch(`${API_BASE_URL}/endusers/user/update_profile_picture/${userId}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
export const updateAgent = async (agentId, updateData) => {
  const res = await api.put(`/agent/updateAgent/${agentId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const updateAgentWidgetDomain = async (id, url) => {
  const data = { url: url }
  const res = await axios.put(`${API_BASE_URL}/agent/updateAgentWidgetDomain/${id}`, data);
  return res.data;
};
export const deleteDomain = async (agentId, domain) => {
  try {
    const res = await fetch(`${API_BASE_URL}/agent/${agentId}/deleteDomain`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Updated domain list:", data.agentWidgetDomain);
    } else {
      console.error("Delete failed:", data.error);
    }
  } catch (err) {
    console.error("Error deleting domain:", err);
  }
};

export const validateWebsite = async (websiteUrl) => {
  try {
    const res = await api.post('/validate-website', { website: websiteUrl });
    return res.data;
  } catch (error) {
    console.error("Error validating website:", error);
    return { valid: false, reason: 'Error validating website' };
  }
};
export const deleteAgent = async (agentId) => {
  try {
    const res = await api.delete(`/agent/deleteAgent/${agentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
      },
    });
    await axios.delete(`https://api.retellai.com/delete-agent/${agentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "Error deleting agent:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete agent from one or both systems.");
  }
};

export const validateEmail = async (email) => {
  try {
    const res = await api.get(`/validate-email?email=${email}`);
    return res.data;
  } catch (error) {
    console.error("Error validating email:", error);
    return { valid: false, reason: 'Error validating email' };
  }
};


export const getUserAgentMergedDataForAgentUpdate = async (agentId, businessId) => {
  try {
    const res = await api.get(`/agent/getUserAgentMergedDataForAgentUpdate/${agentId}?businessId=${businessId}`);
    return res.data;
  } catch (error) {
    console.error("Error validating email:", error);
    return { valid: false, reason: 'Error validating email' };
  }
};

export const getAllAgentCalls = async (userId) => {
  try {
    const res = await api.get(`/agent/user/${userId}/agent/calls`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching agent calls:", error.response?.data || error.message);
    throw new Error("Failed to fetch agent calls");
  }
};
export const fetchUserDetails = async (id) => {
  const userId = id
  try {
    const response = await axios.get(`${API_BASE_URL}/endusers/users/${userId}`)
    return response
  } catch (error) {
    console.log(error)
  }
}

export const toggleAgentActivation = async (agentId, deactivate = true) => {
  try {
    const res = await api.patch(`/agent/toggle-activation/${agentId}`, {
      deactivate,
    },);
    return res.data;
  } catch (error) {
    console.error("Error toggling agent activation:", error.response?.data || error.message);
    throw new Error("Failed to update agent activation status");
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/endusers/users/${userId}`);
    // console.log(response, "response")
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
};

export const updateUserDetails = async (userId, updateData) => {
  try {
    const response = await api.put(`/endusers/users/${userId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details");
  }
};
export const getUserAgentLimitStatus = async (userId) => {
  try {
    const res = await api.get(`/endusers/user-agent-limit-status?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error toggling agent activation:", error.response?.data || error.message);
    throw new Error("Failed to update agent activation status");
  }
};

export const updateLlm = async (llmId, payload) => {
  try {
    const response = await axios.patch(
      `https://api.retellai.com/update-retell-llm/${llmId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`
        }
      }
    );
  } catch (error) {
    console.error(" Error updating LLM:", error.response?.data || error.message);
    alert(`Failed to update LLM: ${JSON.stringify(error.response?.data || error.message)}`);
  }
};
export const fetchLlmDetails = async (llm_id) => {
  const data = { llmId: llm_id }
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/getLlmDetails`, data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response

  } catch (error) {
    console.log(error)
  }
}
export const addGeneralTools = async (llmId, transfers) => {
  console.log(transfers)
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/addGeneralTools`, {
      llmId,
      transfers
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {

  }
}
export const getBusinessDetailsByBusinessId = async (businessId) => {
  try {
    const res = await api.get(`/businessDetails/by-business-id/${businessId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching business details by business ID:", error.response?.data || error.message);
    throw new Error("Failed to fetch business details");
  }
};

export const updateAgentKnowledgeBaseId = async (agentId, knowledgeBaseId) => {
  try {
    const res = await api.patch(`/agent/${agentId}/knowledge-base`, {
      knowledgeBaseId,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating agent knowledge base ID:", error);
    throw new Error("Failed to update knowledge base ID for agent");
  }
};

export const updateEmailSendOtp = async (email, userId) => {
  const res = await api.post('/endusers/updateEmailSendOtp', { email, userId });
  return res;
};

export const updateShowReferralFloatingStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/endusers/updateShowReferralFloatingStatus?userId=${userId}`, { status });
    return response.data
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details");
  }
};

export const getUserReferralCodeForDashboard = async (userId) => {
  try {
    const response = await api.get(`/endusers/getUserReferralCodeForDashboard?userId=${userId}`);
    return response.data
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details");
  }
};

export const updateAgentEventId = async (agentId, eventId) => {
  try {
    const res = await api.patch(`agent/${agentId}/event-id`, {
      eventId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating agent eventId:", error.response?.data || error.message);
    throw new Error("Failed to update eventId for agent");
  }
};

export const refundAndCancelSubscriptionAgnetApi = async (agentId, minutesLeft) => {

  try {
    const res = await axios.post(`${API_BASE_URL}/refund`, {
      agentId, minutesLeft
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return res.data
  } catch (error) {
    console.error("Error refunding user", error.response?.data || error.message);
    throw new Error("Failed to refund user for agent");
  }
}
export const getEndUserSubscriptions_Billings = async (userId) => {
  try {
    const response = await api.get(`/endusers/fetchEndUserSubscriptions_Billings/${userId}`);
    return response.data
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details");
  }
};
export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/agent/delete-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw new Error("Failed to delete user");
  }
};
export const saveAgentSchedule = async (scheduleData) => {
  try {
    const res = await api.post('/agent/schedule-agent', scheduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error saving agent schedule:", error.response?.data || error.message);
    throw new Error("Failed to save agent schedule");
  }
};
export const getAgentScheduleByUserId = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/agent/agent-schedule/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching agent schedule:", error.response?.data || error.message);
    throw new Error("Failed to fetch agent schedule");
  }
}
export const fetchAvailablePhoneNumberByCountry = async (country_code, locality, administrative_area, startsWith, endsWith) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/telnyx/available-numbers`, {
      params: {
        country_code: country_code,
        locality: locality,
        administrative_area: administrative_area,
        starts_with: startsWith,
        ends_with: endsWith
      }
    });
    return res.data;
  } catch (error) {
   return error.response?.data 
   
  }
}
export const createNumberOrder = async (phoneNumbers,agent_id) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/telnyx/create-number-order`, { phoneNumbers: phoneNumbers ,agent_id:agent_id})
    return res.data;
  } catch (error) {
    console.log(error)
  }
}


export default api;