import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup,
    updatePassword
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const doSignInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log('Google sign-in successful:', result);
        return result.user;
    } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
    }
}
export const doSignOut = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('token');
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const doPasswordChange = async (password) => {
    try {
        await updatePassword(auth.currentUser, password);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const doSendPasswordResetEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const doSendEmailVerification = async () => {
    try {
        await sendEmailVerification(auth.currentUser);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const doGetCurrentUser = () => {
    return auth.currentUser;
}