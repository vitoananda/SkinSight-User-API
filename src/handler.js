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

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Link reset email telah dikirimkan ke:', email);
  } catch (error) {
    console.log('Error mengirim email reset password:', error);
    throw error;
  }
};

const uploadProfilePictureHandler = async (request, h) => {
  console.log(request.payload.file);
  try {
    if (!request.payload.file) {
      return h.response('No file uploaded.').code(400);
    }

    return new Promise(async (resolve, reject) => {
      // Create a new blob in the bucket and upload file data
      const blob = bucket.file(request.payload.file.hapi.filename);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', async () => {
        // File successfully uploaded to the bucket

        // Get the public URL of the uploaded file
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        // Extract UID from request parameters
        const { uid } = request.params;

        // Update user document with imageUrl
        const userDoc = doc(db, 'users', uid);
        await updateDoc(userDoc, { imgUrl: publicUrl });

        resolve(h.response('Profile picture berhasil ditambahkan.').code(200));
      });

      blobStream.end(request.payload.file._data);
    });
  } catch (error) {
    throw error;
  }
};


module.exports = {
  signUp,
  signIn,
  signOutUser,
  getUserData,
  editEmail,
  resetPassword,
  uploadProfilePictureHandler,

};
