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
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Todo {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  userId: string;
}

// Add a new todo
export const addTodo = async (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'todos'), {
      ...todoData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

// Update an existing todo
export const updateTodo = async (id: string, data: Partial<Todo>) => {
  try {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, data);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (id: string) => {
  try {
    const todoRef = doc(db, 'todos', id);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
};

// Subscribe to todos for a specific user
export const subscribeToTodos = (userId: string, callback: (todos: Todo[]) => void) => {
  const q = query(
    collection(db, 'todos'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const todos: Todo[] = [];
    querySnapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() } as Todo);
    });
    callback(todos);
  });
};
