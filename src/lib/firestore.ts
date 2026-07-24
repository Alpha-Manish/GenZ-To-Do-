import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  setDoc,
  Timestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

export interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
  createdAt: any;
  userId: string;
}

export interface UserStats {
  activeDates: string[];
  customCategories: string[];
}

export const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task: ', error);
    throw error;
  }
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, data);
  } catch (error) {
    console.error('Error updating task: ', error);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task: ', error);
    throw error;
  }
};

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    callback(tasks);
  });
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  const statsRef = doc(db, 'userStats', userId);
  const snap = await getDoc(statsRef);
  if (snap.exists()) {
    return snap.data() as UserStats;
  }
  return { activeDates: [], customCategories: ['Personal', 'Work', 'Technical Work', 'Long Term Goal'] };
};

export const updateUserStats = async (userId: string, data: Partial<UserStats>) => {
  const statsRef = doc(db, 'userStats', userId);
  await setDoc(statsRef, data, { merge: true });
};

// Batch migration for moving local tasks to Firestore
export const migrateTasksToCloud = async (userId: string, localTasks: any[]) => {
  const batch = writeBatch(db);
  localTasks.forEach(task => {
    const docRef = doc(collection(db, 'tasks'));
    batch.set(docRef, {
      title: task.title || '',
      description: task.description || '',
      completed: task.completed || false,
      priority: task.priority || 'medium',
      category: task.category || 'Personal',
      dueDate: task.dueDate || '',
      userId,
      createdAt: Timestamp.now()
    });
  });
  await batch.commit();
};

export const getTasksForUser = async (userId: string): Promise<Task[]> => {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const tasks: Task[] = [];
  querySnapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() } as Task);
  });
  return tasks;
};

export const clearAllTasks = async (userId: string) => {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  querySnapshot.forEach((document) => {
    batch.delete(document.ref);
  });
  await batch.commit();
};
