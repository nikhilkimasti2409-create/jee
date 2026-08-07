const FIREBASE_PROJECT_ID = 'my-dashboard-e2eb5';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

export const api = {
  async getLiveStatus() {
    try {
      const res = await fetch(`${FIRESTORE_BASE}/LiveStatus/MyData`);
      if (!res.ok) throw new Error('Failed to fetch status');
      const data = await res.json();
      const fields = data.fields || {};
      
      return {
        dailyMetrics: {
          totalTime: Math.floor(Number(fields.totalTimeMs?.integerValue || 0) / (1000 * 60)) + 'm',
        },
        streak: Number(fields.streak?.integerValue || 0),
        isStudying: fields.isStudying?.stringValue?.includes('🟢'),
        currentSubject: fields.isStudying?.stringValue || 'Idle',
        tasks: JSON.parse(fields.tasksJson?.stringValue || '[]'),
        history: JSON.parse(fields.historyJson?.stringValue || '{}'),
        physicsTime: Number(fields.physicsTime?.integerValue || 0),
        chemTime: Number(fields.chemTime?.integerValue || 0),
        mathsTime: Number(fields.mathsTime?.integerValue || 0),
        screenTime: JSON.parse(fields.screenTimeJson?.stringValue || '{}')
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  
  async getHistory() {
    try {
      const res = await fetch(`${FIRESTORE_BASE}/HistoryData`);
      if (!res.ok) return [];
      const data = await res.json();
      
      // Parse Firestore documents
      return (data.documents || []).map((doc: any) => {
        const id = doc.name.split('/').pop();
        const f = doc.fields || {};
        return {
          id,
          totalTimeMs: Number(f.totalTimeMs?.integerValue || 0),
          streak: Number(f.streak?.integerValue || 0),
          physicsTime: Number(f.physicsTime?.integerValue || 0),
          chemTime: Number(f.chemTime?.integerValue || 0),
          mathsTime: Number(f.mathsTime?.integerValue || 0),
          studyLogs: (f.studyLogs?.arrayValue?.values || []).map((v: any) => v.stringValue)
        };
      }).sort((a: any, b: any) => b.id.localeCompare(a.id));
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  
  async getSecurityLogs() {
    // Implement fetching actual security logs from Firestore or mock it
    return [];
  },
  
  async getScreenTime() {
    // Screen time is parsed out of the live status in real scenario
    return null;
  }
};
