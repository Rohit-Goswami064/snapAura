import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doSignInWithGoogle, doSignOut } from "../../firebase/auth";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe();
  }, []);

  async function initializeUser(firebaseUser) {
    if (firebaseUser) {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      };
      setUser(userData);
      setUserLogin(true);
      console.log("✅ User authenticated:", {
        name: userData.displayName,
        email: userData.email,
        hasPhoto: !!userData.photoURL,
      });
      try {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("token", token);
      } catch (error) {
        setError(error);
        console.error("Error getting token:", error);
      }
    } else {
      setUser(null);
      setUserLogin(false);
      localStorage.removeItem("token");
      console.log("👤 User logged out");
    }
    setLoading(false);
  }

  async function loginWithGoogle() {
    try {
      setLoading(true);
      setError(null);
      const user = await doSignInWithGoogle();
      // The onAuthStateChanged listener will handle updating the user state
      return user;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  }

  async function logout() {
    try {
      await doSignOut();
      setUser(null);
      setUserLogin(false);
      setError(null);
    } catch (error) {
      setError(error);
      throw error;
    }
  }

  const value = {
    user,
    userLogin,
    loading,
    error,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
