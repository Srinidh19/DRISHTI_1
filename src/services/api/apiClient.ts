const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = {
  async getCameras() {
    const res = await fetch(`${API_BASE_URL}/cameras`);
    if (!res.ok) throw new Error('Failed to fetch cameras');
    return res.json();
  },

  async getIncidents() {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async performIncidentAction(
    incidentId: string,
    action: string,
    userId: string = 'OP-042',
    role: string = 'OPERATOR',
    note?: string,
    assignee?: string
  ) {
    const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/action`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, user_id: userId, role, note, assignee })
    });
    if (!res.ok) throw new Error('Failed to perform incident action');
    return res.json();
  },

  async getTracks() {
    const res = await fetch(`${API_BASE_URL}/tracks`);
    if (!res.ok) throw new Error('Failed to fetch tracks');
    return res.json();
  },

  async getFences() {
    const res = await fetch(`${API_BASE_URL}/fences`);
    if (!res.ok) throw new Error('Failed to fetch fences');
    return res.json();
  },

  async getZones() {
    const res = await fetch(`${API_BASE_URL}/zones`);
    if (!res.ok) throw new Error('Failed to fetch zones');
    return res.json();
  },

  async getEvidence() {
    const res = await fetch(`${API_BASE_URL}/evidence`);
    if (!res.ok) throw new Error('Failed to fetch evidence');
    return res.json();
  },

  async getSwanTopology() {
    const res = await fetch(`${API_BASE_URL}/swan/topology`);
    if (!res.ok) throw new Error('Failed to fetch SWAN topology');
    return res.json();
  },

  async getSwanWatchRequests() {
    const res = await fetch(`${API_BASE_URL}/swan/watch-requests`);
    if (!res.ok) throw new Error('Failed to fetch watch requests');
    return res.json();
  },

  async getShieldFaults() {
    const res = await fetch(`${API_BASE_URL}/shield/faults`);
    if (!res.ok) throw new Error('Failed to fetch SHIELD faults');
    return res.json();
  },

  async dispatchShieldMaintenance(faultId: string, userId: string = 'OP-042') {
    const res = await fetch(`${API_BASE_URL}/shield/faults/${faultId}/dispatch?user_id=${userId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to dispatch maintenance');
    return res.json();
  },

  async getSystemHealth() {
    const res = await fetch(`${API_BASE_URL}/system/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE_URL}/audit`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async updateUserRole(userId: string, role: string) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
  },

  async createUser(userData: any) {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },

  async createCamera(cameraData: any) {
    const res = await fetch(`${API_BASE_URL}/cameras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cameraData)
    });
    if (!res.ok) throw new Error('Failed to create camera');
    return res.json();
  },

  async slewCamera(cameraId: string, pan: number = 0, tilt: number = 0, zoom: number = 1) {
    const res = await fetch(`${API_BASE_URL}/cameras/${cameraId}/slew?pan=${pan}&tilt=${tilt}&zoom=${zoom}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to slew camera');
    return res.json();
  },

  async createIncident(incidentData: any) {
    const res = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData)
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async createFence(fenceData: any) {
    const res = await fetch(`${API_BASE_URL}/fences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fenceData)
    });
    if (!res.ok) throw new Error('Failed to create fence');
    return res.json();
  },

  async createZone(zoneData: any) {
    const res = await fetch(`${API_BASE_URL}/zones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneData)
    });
    if (!res.ok) throw new Error('Failed to create zone');
    return res.json();
  },

  async createEvidence(evidenceData: any) {
    const res = await fetch(`${API_BASE_URL}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidenceData)
    });
    if (!res.ok) throw new Error('Failed to create evidence');
    return res.json();
  },

  // Demo Scenarios
  async triggerDemoStep(stepNumber: number) {
    const res = await fetch(`${API_BASE_URL}/demo/step/${stepNumber}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to trigger demo step');
    return res.json();
  },

  async triggerDemoTrack() {
    const res = await fetch(`${API_BASE_URL}/demo/track`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to simulate track');
    return res.json();
  },

  async triggerDemoCameraFailure() {
    const res = await fetch(`${API_BASE_URL}/demo/camera-failure`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to simulate camera failure');
    return res.json();
  },

  async triggerDemoReset() {
    const res = await fetch(`${API_BASE_URL}/demo/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset demo');
    return res.json();
  }
};
