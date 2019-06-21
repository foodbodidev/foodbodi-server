# foodbodi-server
## Flows
#### Login by email & password
#### Login by Google Sign In
#### Login by Facebook Sign In
#### User info
#### Add restaurant / foodtruck
#### Get nearby & track locations
#### Chat 
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
### POST /api/login
- Input
```$xslt
{
    email : String (required),
    password : String (non-hashed, required) ,
}
```
- Output
```$xslt
{
    status : "OK",
    token : String
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
- Output
```$xslt
{
    status : "OK",
    token : String
}
```
### POST /api/facebookSignIn
### GET /api/profile
- Extract user data by token
- Require token in header
- Output : User

### POST /api/profile
- Update user data
- Require token in header
