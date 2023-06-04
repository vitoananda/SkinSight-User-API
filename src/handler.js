const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } = require('firebase/auth');
const { doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');
const { getDownloadURL, ref, uploadBytes } = require('firebase/storage');
const { auth, db } = require('../src/db/firebase');
const { sendPasswordResetEmail } = require('firebase/auth');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const fs = require('fs');
const Path = require('path');

const bucket = storage.bucket('skinsight-user-profilepicture');


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

const editEmail = async (uid, email, password, currentEmail, currentPassword) => {
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

const editName = async (uid, name, currentName) => {
  try {
    const userDoc = doc(db, 'users', uid);

    const userSnapshot = await getDoc(userDoc);
    const userData = userSnapshot.data();
    if (userData.name === currentName) {
      const updateData = { name };

      await updateDoc(userDoc, updateData);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error melakukan update nama:', error);
    throw new Error('Gagal melakukan update nama');
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

const uploadProfilePicture = async (request, h) => {
  try {
    if (!request.payload.file) {
      const response = h.response({
        status: 'Failed',
        message: 'Tidak ada file yang ditambahkan',
      });
      response.code(400);
      return response;
    }

    const { uid } = request.params;
    const fileName = request.payload.file.hapi.filename;
    const blob = bucket.file(fileName);
    const [exists] = await blob.exists();
    if (exists) {
      await blob.delete();
    }

    return new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        const response = h.response({
          status: 'Failed',
          message: 'Terjadi error menambahkan profile picture',
        });
        response.code(500);
        reject(response);
      });

      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        const userDoc = doc(db, 'users', uid);
        await updateDoc(userDoc, { imgUrl: publicUrl });

        const response = h.response({
          status: 'Success',
          message: 'Profile picture berhasil ditambahkan',
        });
        response.code(200);
        resolve(response);
      });

      blobStream.end(request.payload.file._data);
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    const response = h.response({
      status: 'Failed',
      message: 'An internal server error occurred',
      error: error.message, // Include the error message in the response
    });
    response.code(500);
    return response;
  }
};



module.exports = {
  signUp,
  signIn,
  signOutUser,
  getUserData,
  editEmail,
  resetPassword,
  uploadProfilePicture,
  editName

};
