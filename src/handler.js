const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } = require('firebase/auth');
const { doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');
const { auth, db } = require('../src/db/firebase');
const { sendPasswordResetEmail } = require('firebase/auth');

const signUp = async (email, password, name, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      name,
      email,
      phone,
    });
    return user;
  } catch (error) {
    console.log('Error melakukan sign up:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email sudah terdaftar');
    } else {
      throw error;
    }
  }
};

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.log('Error melakukan sign in:', error);
    throw error;
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log('Error melakukan sign out:', error);
    throw error;
  }
};

const getUserData = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.log('Error mendapatkan data user:', error);
    throw error;
  }
};

const editProfile = async (uid, email, password, currentEmail, currentPassword) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, currentEmail, currentPassword);
    if (user.uid === uid) {
      const userDoc = doc(db, 'users', uid);
      const updateData = {};
      if (email) updateData.email = email;

      await updateDoc(userDoc, updateData);
      if (email) await updateEmail(user, email);
      if (password) await updatePassword(user, password);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error merubah email:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email sudah digunakan oleh akun lain');
    } else {
      throw error;
    }
  }
};

const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Link reset email telah dikirimkan ke:', email);
    } catch (error) {
      console.log('Error mengirim email reset password:', error);
      throw error;
    }
  };

module.exports = { signUp, signIn, signOutUser, getUserData, editProfile, resetPassword };
