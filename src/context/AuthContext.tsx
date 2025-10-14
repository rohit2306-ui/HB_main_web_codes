import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import {
  createUser,
  signOutUser,
  getCurrentUserData,
} from "../services/authService";
import { User, AuthContextType, SignupData } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Firebase user listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userData = await getCurrentUserData(firebaseUser);
          setUser(userData);
        } else {
          setUser(null);
        }
        setInitialLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Email/password login
  const loginWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = await getCurrentUserData(userCredential.user);
      setUser(userData);
      setAuthLoading(false);
      return { success: true, user: userData };
    } catch (error: any) {
      setAuthLoading(false);
      return { success: false, error: error.message || "Invalid credentials" };
    }
  };

  // Google login
  const loginWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      await createUser({
        email: firebaseUser.email || "",
        username:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "user",
        uid: firebaseUser.uid,
        photoURL: firebaseUser.photoURL || "",
      });

      setAuthLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error(error);
      setAuthLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signup = async (
    userData: SignupData
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      const result = await createUser(userData);
      setAuthLoading(false);
      return result;
    } catch (error) {
      setAuthLoading(false);
      return { success: false, error: "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const value: AuthContextType = {
    user,
    login: loginWithEmail,
    loginWithEmail,
    signup,
    logout,
    loginWithGoogle,
    loading: authLoading,
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
