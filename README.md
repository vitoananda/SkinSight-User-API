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


### GET /user/{uid}
Mengambil informasi user berdasarkan uid.

Request parameter:
uid: uid user

Response:

200 OK jika data user berhasil ditemukan. 

### POST /sign-out
Melakukan sign out user dari aplikasi.

Response:

200 OK jika sign out berhasil.


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


