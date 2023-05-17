const Joi = require('joi');
const { signUp, signIn, signOutUser, getUserData, editProfile, resetPassword } = require('../src/handler');

const singUpRoute = {
  method: 'POST',
  path: '/sign-up',
  handler: async (request, h) => {
    const { email, password, name,  phone,} = request.payload;
    try {
      const user = await signUp(email, password, name, phone);
      return h.response({ message: 'User berhasil di tambahkan', uid: user.uid }).code(201);
    } catch (error) {
      console.error('Error registering user:', error);
      return h.response({ message: error.message }).code(400);
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        name: Joi.string().required(),
        phone: Joi.string().required(),
        
      }),
    },
  },
};

const signInRoute = {
  method: 'POST',
  path: '/sign-in',
  handler: async (request, h) => {
    const { email, password } = request.payload;
    try {
      const user = await signIn(email, password);
      return h.response('Sign in berhasil').code(200);
    } catch (error) {
      console.error('Error logging in user:', error);
      return h.response('Error logging in user').code(500);
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      }),
    },
  },
};

const resetPasswordRoute = {
  method: 'POST',
  path: '/reset-password',
  handler: async (request, h) => {
    const { email } = request.payload;
    try {
      await resetPassword(email);
      return h.response({ message: 'Link reset password telah di kirim ke email' }).code(200);
    } catch (error) {
      console.error('Error melakukan reset password:', error);
      return h.response({ message: 'Error melakukan reset password' }).code(500);
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
      }),
    },
  },
};

const userInfoRoute = {
  method: 'GET',
  path: '/user/{uid}',
  handler: async (request, h) => {
    const { uid } = request.params;
    try {
      const data = await getUserData(uid);
      if (data) {
        return h.response({ email: data.email, phone: data.phone }).code(200);
      } else {
        return h.response('Data tidak ditemukan').code(404);
      }
    } catch (error) {
      console.error('Error saat mengambil data pengguna:', error);
      return h.response('Error saat mengambil data pengguna').code(500);
    }
  },
};

const signOutRoute = {
  method: 'POST',
  path: '/sign-out',
  handler: async (request, h) => {
    try {
      await signOutUser();
      return h.response({ message: 'Berhasil signout' }).code(200);
    } catch (error) {
      console.error('Error melakukan sign out:', error);
      return h.response({ message: 'Error melakukan sign out' }).code(400);
    }
  },
};

const editEmailRoute = {
  method: 'PUT',
  path: '/edit-email/{uid}',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().min(8).optional(),
        currentEmail: Joi.string().email().required(),
        currentPassword: Joi.string().min(8).required(),
      }),
      params: Joi.object({
        uid: Joi.string().required(),
      }),
    },
  },
  handler: async (request, h) => {
    const { uid } = request.params;
    const { email, password, currentEmail, currentPassword } = request.payload;

    try {
      const result = await editProfile(uid, email, password, currentEmail, currentPassword);
      if (result) {
        return h.response({ message: 'Email berhasil di ubah' }).code(200);
      } else {
        return h.response({ message: 'User tidak diizinkan untuk mengedit profil' }).code(403);
      }
    } catch (error) {
      console.error('Error melakukan update email:', error);
      return h.response({ message: 'Error melakukan update email' }).code(500);
    }
  },
};

module.exports = [singUpRoute, signInRoute, userInfoRoute, signOutRoute, editEmailRoute, resetPasswordRoute];
