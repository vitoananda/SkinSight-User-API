# Endpoints

| Method | Endpoint           |
| ------ | ------------------ |  
| POST   | /sign-up           | 
| POST   | /sign-in           | 
| POST   | /reset-password    | 
| GET    | /user/{uid}        | 
| POST   | /sign-out          | 
| PUT    | /edit-email/{uid}  | 

<hr>

### <b>POST /sign-up</b>
Mendaftarkan user baru ke dalam database. 

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

<hr>

### <b>POST /sign in</b>
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

<hr>

### <b>POST /reset-password</b>
Me request reset password user.

Request body:
```json
{
  "email": "resetpassword@gmail.com"
}
```

Response:

200 OK jika permintaan reset password berhasil.

<hr>

### <b>GET /user/{uid}</b>
Mengambil informasi user berdasarkan uid.

Request parameter:
uid: uid user

Response:

200 OK jika data user berhasil ditemukan. 

<hr>

### <b>POST /sign-out</b>
Melakukan sign out user dari aplikasi.

Response:

200 OK jika sign out berhasil.

<hr>

### <b>PUT /edit-email/{uid}</b>
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


