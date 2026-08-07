const FIREBASE_PROJECT_ID = 'my-dashboard-e2eb5';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

export const api = {
  async getStudentsForParent(parentEmail: string): Promise<string[]> {
    try {
      // Using REST API StructuredQuery to find all LiveStatus documents where allowedParents array contains parentEmail
      const res = await fetch(`${FIRESTORE_BASE}/LiveStatus`);
      if (!res.ok) return [];
      const data = await res.json();
      
      const allowedStudents: string[] = [];
      (data.documents || []).forEach((doc: any) => {
         const id = doc.name.split('/').pop();
         const allowed = doc.fields?.allowedParents?.arrayValue?.values || [];
         if (allowed.some((v: any) => v.stringValue === parentEmail)) {
            allowedStudents.push(id);
         }
      });
      return allowedStudents;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getLiveStatus(studentId: string) {
    if (!studentId) return null;
    try {
      const res = await fetch(`${FIRESTORE_BASE}/LiveStatus/${studentId}`);
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
        activeAppTitle: fields.activeAppTitle?.stringValue || 'Offline',
        currentUrl: fields.currentUrl?.stringValue || '',
        sessionStartTime: Number(fields.sessionStartTime?.integerValue || 0),
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
  
  async getHistory(studentId: string) {
    if (!studentId) return [];
    try {
      const res = await fetch(`${FIRESTORE_BASE}/HistoryData_${studentId}`);
      if (!res.ok) return [];
      const data = await res.json();
      
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
  
  async getSecurityLogs(studentId?: string) {
    if (!studentId) return [];
    try {
      // Using REST API to get all documents from SecurityViolations
      const res = await fetch(`${FIRESTORE_BASE}/SecurityViolations`);
      if (!res.ok) return [];
      const data = await res.json();
      
      const logs = (data.documents || [])
        .filter((doc: any) => doc.fields?.studentId?.stringValue === studentId)
        .map((doc: any) => {
          const f = doc.fields || {};
          return {
            id: doc.name.split('/').pop(),
            type: f.type?.stringValue || 'security_violation',
            details: f.details?.stringValue || 'Unknown violation',
            timestamp: f.timestamp?.stringValue || new Date().toISOString(),
            dateStr: f.dateStr?.stringValue || ''
          };
        })
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
      return logs;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};
