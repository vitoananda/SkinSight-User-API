# Endpoints

| Method | Endpoint           |
| ------ | ------------------ |  
| POST   | /sign-up           | 
| POST   | /sign-in           | 
| POST   | /reset-password    | 
| GET    | /user/{uid}        | 
| POST   | /sign-out          | 
| PUT    | /edit-email/{uid}  | 


### POST /sign-up
Mendaftarkan user baru ke dalam aplikasi. 

Request body: 
```json
{ 
  "email": "useremail@gmail.com", 
  "password": "userpassword",
  "name": "john",
  "phone": "083152213882" 
} 
```
Response: 

201 Created jika user berhasil didaftarkan. 

Response body:
```json

{ 
  "message": "User berhasil di tambahkan",
  "uid": "uiduser"
} 
```

400 Bad Request jika email sudah terdaftar.

Response body: 
```json

{ 
  "message": "Email sudah terdaftar" 
}
``` 

### POST /sign in
Melakukan sign in user. 

Request body:
```json
{
  "email": "useremail@gmail.com",
  "password": "userpassword"
}
```
Response:

200 OK jika sign in berhasil.

Response body:
```json
{
  "Sign In Berhasil"
}
```

500 Internal Server Error jika terjadi kesalahan pada server.


### POST /reset-password
Me request reset password user.

Request body:
```json
{
  "email": "resetpassword@gmail.com"
}
```

Response:

200 OK jika permintaan reset password berhasil.

Response body:

```json
{
  "message": "Link reset password telah di kirim ke email"
}
```

400 Bad Request jika terjadi kesalahan pada input data.

Response body:

```json
{
  "message": "error message"
}
```

500 Internal Server Error jika terjadi kesalahan pada server.


### GET /user/{uid}
Mengambil informasi user berdasarkan uid.

Request parameter:
uid: uid user

Response:

200 OK jika data user berhasul ditemukan. 
Response body:

```json
{
  "email": "useremail@gmail.com",
  "phone": "083152213882"
}
```
404 Not Found jika user tidak ditemukan.

500 Internal Server Error jika terjadi kesalahan pada server.

### POST /sign-out
Melakukan sign out user dari aplikasi.

Response:

200 OK jika sign out berhasil.

400 Bad Request jika terjadi kesalahan saat melakukan sign out.

### PUT /edit-email/{uid}
Mengubah email user berdasarkan uid.

Request parameter:
uid: uid user

Request body:
```json
{
  "email": "emailbaruu@contoh.com",
  "password": "passwordbaru",
  "currentEmail": "emaillama@contoh.com",
  "currentPassword": "passwordlama"
}
```
Response:

200 OK jika profil berhasil diubah.

403 Forbidden jika user tidak memiliki akses untuk mengubah profil.

500 Internal Server Error jika terjadi kesalahan pada server.
