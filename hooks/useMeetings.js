import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";

export default function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const meetingsRef = collection(db, "meetings");
    const q = query(
      meetingsRef,
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meetingsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeetings(meetingsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addMeeting = async (meetingData) => {
    try {
      await addDoc(collection(db, "meetings"), {
        ...meetingData,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        completed: false,
      });
    } catch (error) {
      console.error("Error adding meeting:", error);
      throw error;
    }
  };

  const updateMeeting = async (meetingId, updates) => {
    try {
      const meetingRef = doc(db, "meetings", meetingId);
      await updateDoc(meetingRef, updates);
    } catch (error) {
      console.error("Error updating meeting:", error);
      throw error;
    }
  };

  const deleteMeeting = async (meetingId) => {
    try {
      await deleteDoc(doc(db, "meetings", meetingId));
    } catch (error) {
      console.error("Error deleting meeting:", error);
      throw error;
    }
  };

  const toggleComplete = async (meetingId, currentStatus) => {
    await updateMeeting(meetingId, { completed: !currentStatus });
  };

  return {
    meetings,
    loading,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    toggleComplete,
  };
}
