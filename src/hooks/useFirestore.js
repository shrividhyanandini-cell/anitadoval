import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../utils/firebase'

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Real-time data fetching
  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, collectionName))

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort locally to prevent Firestore caching assertion failures
        docs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0)
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0)
          return timeB - timeA
        })
        setDocuments(docs)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [collectionName])

  // Add document
  const addDocument = async (data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { success: true, id: docRef.id }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Update document
  const updateDocument = async (id, data) => {
    try {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Delete document
  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument
  }
}