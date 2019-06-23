# foodbodi-server
## Flows
#### Login by email & password
1. Register new user by POST /api/register
2. Login by POST /api/login, if success, server returns a token
3. Token is base64 encrypted, include it in http headers with header_name "token" for another api requests
#### Login by Google Sign In
1. User logins by GoogleSignIn button
2. Use the token returned from Google, send to POST /api/googleSignIn
3. If email of user is not exists, server will create new account with field need_password = false.
4. Server will return a token encrypted by base64, include it in http headers with header_name "token" for another api requests.
#### Login by Facebook Sign In
1. User logins by GoogleSignIn button
2. Use the token returned from Google, send to POST /api/facebookSignIn
3. If email of user is not exists, server will create new account with field need_password = false.
4. Server will return a token encrypted by base64, include it in http headers with header_name "token" for another api requests.
#### User info
- User data is included in reponses from login apis as name "data"
- Can obtain from GET /api/profile (require token)
- To update profile, use POST /api/profile (require token)
#### Add restaurant / food_truck
Implementing...
#### Get nearby & track locations
Not implement yet
#### Chat 
Not implement yet
## Collections
### User
- Collection Name : users <br>
- Format : <br>
```
{
    email : String ,
    password : String (hashed),
    sex : String ("MALE"/ "FEMALE"),
    height : Number,
    weight : Number,
    target_weight : Number,
    need_password : Boolean (false when user use Google SignIn or facebook Signin)
}
```
### Restaurant
- Collection name : restaurants <br>
- Format : <br>
```$xslt
{
    type : String ("RESTAURANT", "FOOD_TRUCK"),
    name : String,
    location : Geographical point,
}
```
### Food
- Collection name : foods
- Format :
```$xslt
{
    name : String,
    restaurant_id : String,
    calo : Number,
    price : Number,
}
   
```
## APIs
### POST /api/register
- Input
```$xslt
{
    email : String (required),
    password : String (non-hashed, required) ,
    sex : String ("MALE"/ "FEMALE", optional),
    height : Number (optional),
    weight : Number (optional),
    target_weight : (optional),
}
```
- Output (if success)
```$xslt
{
    status : "OK",
}
```
### POST /api/login
- Input
```$xslt
{
    email : String (required),
    password : String (non-hashed, required) ,
}
```
- Output (if success)
```$xslt
{
    status : "OK",
    token : String,
    data : user data as json
}
```
### POST /api/googleSignIn
- Create new account if needed 
- Input
```$xslt
{
    google_id_token : String (token obtained after Google Sign In process)
}
```
- Output (if success)
```$xslt
{
    status : "OK",
    token : String,
    data : user's data if user already exist
}
```
### POST /api/facebookSignIn
- Create new account if needed 
- Input
```$xslt
{
    facebook_access_token : String (token obtained after Fave Sign In process)
    user_id : String (obtained after Fave Sign In process)
}
```
- Output (if success)
```$xslt
{
    status : "OK",
    token : String,
    data : user's data if user already exist
}
```
### GET /api/profile
- Extract user data by token
- Require token in header
- Output : User

### POST /api/profile
- Update user data
- Require token in header
