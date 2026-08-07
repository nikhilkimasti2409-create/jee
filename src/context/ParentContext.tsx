import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

interface ParentContextType {
  students: string[];
  selectedStudent: string | null;
  setSelectedStudent: (id: string) => void;
  loading: boolean;
  refreshStudents: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const ParentContext = createContext<ParentContextType>({
  students: [],
  selectedStudent: null,
  setSelectedStudent: () => {},
  loading: true,
  refreshStudents: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
});

export function ParentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    const parentId = localStorage.getItem('userEmail');
    if (parentId) {
      const allowed = await api.getStudentsForParent(parentId);
      setStudents(allowed);
      if (allowed.length > 0 && !allowed.includes(selectedStudent || '')) {
        setSelectedStudent(allowed[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <ParentContext.Provider value={{ students, selectedStudent, setSelectedStudent, loading, refreshStudents: fetchStudents, searchQuery, setSearchQuery }}>
      {children}
    </ParentContext.Provider>
  );
}

export const useParent = () => useContext(ParentContext);
