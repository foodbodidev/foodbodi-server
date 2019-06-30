# foodbodi-server
## Setup
#### Local server
Basically, we will run a local node server with a remote Firestore database
- Contact credential manager to get the firestore service-account credential (.json file) , or you can create an app-engine project yourself with your personal Firestore.
- Copy that credential to folder named "src/server/credentials"
- On Terminal run : ```export FOODBODI_ENV=dev```
- Start sever : ```npm run start```.

__*Beware, when you use the same Firestore with another, you are sharing the same database with them while testing on your local*__
#### Unit test
Finding a mock technique for firestore ....
#### Deployment
- Install gcloud tools
- Run: ```gcloud projects create foodbodi```
- Create new gcloud configuration : ```gcloud config configurations create foodbodi```
- Run : ```gcloud auth login```
- To deploy, go to src/server folder, run: ```gcloud app deploy```.

__*Beware, you may need to be granted the deployment permission by admin.*__
## Flows
#### Login by email & password
1. Register new user by POST /api/register
2. Login by POST /api/login, if success, server returns a token
3. Token is base64 encrypted, include it in http headers with header_name "token" for another api requests
#### Login by Google Sign In
1. User logins by GoogleSignIn button
2. Use the token returned from Google, send to POST /api/googleSignIn
3. If email of user is not exists, server will create new account with field need_password = false and user's data in the request.
4. Server will return a token encrypted by base64, include it in http headers with header_name "token" for another api requests.
#### Login by Facebook Sign In
1. User logins by GoogleSignIn button
2. Use the token returned from Google, send to POST /api/facebookSignIn
3. If email of user is not exists, server will create new account with field need_password = false and user's data in the request.
4. Server will return a token encrypted by base64, include it in http headers with header_name "token" for another api requests.
#### User info
- User data is included in reponses from login apis as name "data"
- Can obtain from GET /api/profile (require token)
- To update profile, use POST /api/profile (require token)
#### Add restaurant / food_truck
 Make sure you have a token
- To create new one : POST /api/restaurant 
- To update existing one : PUT /api/restaurant/{restaurant_id}
- To delete : DELETE /api/restaurant/{restaurant_id}
- To get data : GET /api/restaurant/{restaurant_id}
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
    first_name : String,
    last_name : String,
    
    email : String ,
    password : String (hashed),
    sex : String ("MALE"/ "FEMALE"),
    height : Number,
    weight : Number,
    target_weight : Number,
    need_password : Boolean (false when user use Google SignIn or facebook Signin)
    
    complete_profile : Boolean // indicate that whether user has filled all neccessary information in profile
}
```
### Restaurant
- Collection name : restaurants <br>
- Format : <br>
```$xslt
{
    type : String ("RESTAURANT", "FOOD_TRUCK"),
    category : String ("FAST_FOOD", "ORDINARY",... )
    name : String,
    address : String,
    creator : String ( User.id of creator)
    lat : Number,
    lng : Number,
    
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
Every response has status field & data field. 
- Status value can be
```
module.exports = {
       SUCCESS : 0,
       ERROR : 500,
       LOGIN_EXCEPTION : 501,
       FIRESTORE_UPDATE_FAIL : 502,
       FIRESTORE_GET_FAIL : 503,
   
       UNAUTHORIZED : 300,
       USER_NOT_FOUND : 301,
       USER_EXISTS : 302,
   
       WRONG_FORMAT : 400,
   
       GOOGLE_LOGIN_FAIL : 600,
   
       FACEBOOK_LOGIN_FAIL : 650,
   
   };
```
- Data field is what you expect in the API, based on each API
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
    age : Number,
    first_name : String,
    last_name : String
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
    status_code : 0,
    token : String,
    data : {
        user : {..User data},
        token : access token to be included in header
    }
}
```
### POST /api/googleSignIn
- Create new account if needed 
- Input
```$xslt
{
    google_id_token : String (token obtained after Google Sign In process),
    ...User data (except email & password)
}
```
- Output (if success)
```$xslt
{
    status : 0,
    data : {
        user : ...User data,
        token : String
    }
}
```
### POST /api/facebookSignIn
- Create new account if needed 
- Input
```$xslt
{
    facebook_access_token : String (token obtained after Fave Sign In process)
    user_id : String (obtained after Fave Sign In process),
    ...User data (except email & password)
}
```
- Output (if success)
```$xslt
{
    status : 0,
    data : {
                user : ...User data,
                token : String
            }
}
```
### GET /api/profile
- Extract user data by token
- Require token in header
- Output : User

### POST /api/profile
- Update user data
- Require token in header


### GET/api/restaurant/{restaurant_id}

### POST/api/restaurant
```$xslt
{
    ...Restaurant data
}
```
### PUT/api/restaurant/{restaurant_id}
```$xslt
{
    ...updated data
}
```
### DELETE/api/restaurant/{restaurant_id}

