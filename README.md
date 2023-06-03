# How to use
clone repository dengan 
```json
{
  git clone https://github.com/vitoananda/SkinSight-User-API.git
}
```

Kemudian masukan file keyfile,json yang anda dapatkan dari service account anda yang memiliki role Cloud Storage Admin, Cloud Storage Creator, dan Cloud Storage Viewer

Kemudian ubah isi file .env anda dengan konfigurasi project firebase anda

# Endpoints

| Method | Endpoint           |
| ------ | ------------------ |  
| POST   | /sign-up           | 
| POST   | /sign-in           | 
| POST   | /reset-password    | 
| GET    | /user/{uid}        | 
| POST   | /sign-out          | 
| PUT    | /edit-email/{uid}  |
| POST   | /user/{uid}/profile-picture  |


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

```json
{
   "status": "Success",
   "message": "User berhasil di tambahkan",
   "data" : {
          "uid": "user.uid",
          "name" : "user.name"
        }
}
```
201 Jika user berhasil ditambahkan

```json
{
  "status": "Failed",
  "message": "Error menambahkan user"
}
```
400 Jika user gagal ditambahkan



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

```json
{
 "status": "Success",
 "message": "Sign in berhasil",
 "data":{
            "uid": "user.uid", 
            "email": "user.email"
        }
}
```
200 Jika Sign in berhasil

```json
{
   "status": "Failed",
   "message": "Error melakukan Sign In"
}
```
500 Jika terjadi error melakukan Sign In

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

```json
{
   "status": "Success",
   "message": "Link reset password telah di kirim ke email",
}
```
200 Jika reset password berhasil

```json
{
  "status": "Failed",
  "message": "Error melakukan reset password"
}
```
500 Jika terjadi error melakukan reset password
<hr>

### <b>GET /user/{uid}</b>
Mengambil informasi user berdasarkan uid.

Request parameter:
uid: uid user

Response:
```json
{
   "status": "Success",
   "data": {
            "name": "data.name", 
            "email": "data.email", 
            "phone": "data.phone", 
            "imgUrl":" data.imgUrl"
          },
}
```
200 Jika data user berhasil ditemukan

```json
{
 "status": "Failed",
 "message": "Data tidak ditemukan"
}
```
404 Jika data user tidak ditemukan

```json
{
   "status": "Failed",
   "message": "Error saat mengambil data pengguna",
}
```
500 Jika terjadi error saat mengambil data pengguna
<hr>

### <b>POST /sign-out</b>
Melakukan sign out user dari aplikasi.

Response:

```json
{
  "status": "Success",
  "message": "Berhasil Sign Out",
}
```
200 Jika berhasil sign out

```json
{
  "status": "Failed",
  "message": "Error melakukan Sign Out"
}
```
400 Jika terjadi error melakukan Sign Out

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

```json
{
   "status": "Success",
   "message": "Email berhasil di ubah",
}
```
200 Jika email berhasil di ubah

```json
{
   "status": "Failed",
   "message": "User tidak diizinkan untuk mengedit profil",
}
```
403 Jika user tidak diizinkan untuk mengedit profil

```json
{
   "status": "Failed",
   "message": "Error melakukan update email",
}
```
500 Jika terjadi error melakukan edit email

### <b>POST /user/{uid}/profile-picture</b>
menambahkan profile picture user berdasarkan uid

Request parameter:
uid: uid user

request body:
<p align="left"> <img src="./documentation asset/Screenshot_7.jpg" width="700" height="200" /> </p>

Response:

```json
{
  "status": "Success",
  "message" : "Profile picture berhasil ditambahkan"
}
```
200 Jika profile picture berhasil ditambahkan

```json
{
  "status": "Failed",
  "message" : "Terjadi error menambahkan profile picture"
}
```
500 Jika terjadi error menambahkan profile picture

```json
{
  "status": "Failed",
  "message" : "Ukuran file melebihi batas maksimum (10MB)"
}
```
400 JIka ikuran file melebihi batas maksimum (10MB)