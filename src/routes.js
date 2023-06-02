const Joi = require('joi');
const { multerMid, signUp, signIn, signOutUser, getUserData, editEmail, resetPassword, uploadProfilePictureHandler } = require('../src/handler');

const singUpRoute = {
  method: 'POST',
  path: '/sign-up',
  handler: async (request, h) => {
    const { email, password, name,  phone,} = request.payload;
    try {
      const user = await signUp(email, password, name, phone);
      const response = h.response({
        status: 'Success',
        message: 'User berhasil di tambahkan',
        data : {
          uid: user.uid,
          name : user.name
        }
      }
      );
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Error menambahkan user',
    })
    response.code(400);
    return response;
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
      const response = h.response({
        status: 'Success',
        message: 'Sign in berhasil',
        data:{
            uid: user.uid, 
            email: user.email
        }
      }
      );
      response.code(200);
      return response;
    } catch (error) {
        const response = h.response({
            status: 'Failed',
            message: 'Error melakukan Sign In',
        })
        response.code(500);
        return response;
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
      const response = h.response({
        status: 'Success',
        message: 'Link reset password telah di kirim ke email',
      }
      );
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Error melakukan reset password',
    })
    response.code(500);
    return response;
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
        const response = h.response({
          status: 'Success',
          data: {
            name: data.name, email: data.email, phone: data.phone, imgUrl: data.imgUrl
          },
        }
        );
        response.code(200);
        return response;
      } else {
        const response = h.response({
          status: 'Failed',
          message: 'Data tidak ditemukan',
        }
        );
        response.code(404);
        return response;
      }
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Error saat mengambil data pengguna',
      }
      );
      console.error('Error saat mengambil data pengguna:', error);
      response.code(500);
      return response;
    }
  },
};

const signOutRoute = {
  method: 'POST',
  path: '/sign-out',
  handler: async (request, h) => {
    try {
      await signOutUser();
      const response = h.response({
        status: 'Success',
        message: 'Berhasil Sign Out',
      }
      );
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Error melakukan Sign Out',
      }
      );
      response.code(400);
      return response;
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
      const result = await editEmail(uid, email, password, currentEmail, currentPassword);
      if (result) {
        const response = h.response({
          status: 'Success',
          message: 'Email berhasil di ubah',
        }
        );
        response.code(200);
        return response;
      } else {
        const response = h.response({
          status: 'Failed',
          message: 'User tidak diizinkan untuk mengedit profil',
        }
        );
        response.code(403);
        return response;
      }
    } catch (error) {
      const response = h.response({
        status: 'Failed',
        message: 'Error melakukan update email',
      }
      );
      response.code(500);
      return response;
    }
  },
};

const uploadProfilePictureRoute = {
  method: 'POST',
  path: '/user/{uid}/profile-picture',
  handler: uploadProfilePictureHandler,
  options: {
    payload: {
      output: 'stream',
      parse: true,
      multipart: true,
      allow: 'multipart/form-data',
    },
  },
};

module.exports = [singUpRoute, signInRoute, userInfoRoute, signOutRoute, editEmailRoute, resetPasswordRoute,uploadProfilePictureRoute];
