# foodbodi-server
## Setup
#### Local server
Basically, we will run a local node server with a remote Firestore database
- Contact credential manager to get the firestore service-account credential (.json file) , or you can create an app-engine project yourself with your personal Firestore.
- Copy that credential to folder named "src/server/credentials" as name : ```firestore-service-account.json```
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
#### Add restaurant
Make sure you have a token
- To create new one + add foods + license: [POST /api/restaurant](#create-restaurant)
- To update existing one + add foods : [PUT /api/restaurant/{restaurant_id}](#update-food)
- To delete : [DELETE /api/restaurant/{restaurant_id}](#delete-restaurant)
- To get data : [GET /api/restaurant/{restaurant_id}](#get-restaurant)
- To get the menu of a restaurant : [GET /api/restaurant/{restaurant_id}/foods](#list-food-by-restaurant-id)

#### Recommend flow
- After user enter license, we send [POST /api/restaurant](#create-restaurant) to create new one first then get the restaurant_id
- In the Add form, when user add a food, we can [POST /api/food](#create-food) to add directly
- If user delete food, we call [DELETE /api/food](#delete-food) to delete directly
- When user hit submit, we only send restaurant information to update the restaurant [PUT /api/restaurant](#update-restaurant)

- <b>When user edit restaurant, we can reuse above logic.</b>

#### Create, Update, Delete foods
- To create : [POST /api/food](#create-food)
- To create many foods for an restaurant at once : [POST /api/food/import](#import-foods)
- To update : [PUT /api/food/{id}](#update-food)
- To get : [GET /api/food/{id}](#get-food)
- To delete : [DELETE /api/food/{id}?restaurant_id={...}](#delete-food)

#### Get nearby & track locations
- Do in client side using firetstore's library
- With devices lonk to a Food truck, send location data to backend every 5s
- To get nearby locations (psudecode) : 
```

```

### Upload photo
- Send a multipart POST request to ```/api/upload/photo?filename={file name to be in storage}```
The key for the file to be uploaded is "<b>file</b>" <br>
<i>Notice :  filename will be concatinated with timestamp in server to avoid override existing file.</i>
A multipart request looks like
```
POST /api/upload/photo?filename=myfile HTTP/1.1
Host: foodbodi.appspot.com
Content-Type: multipart/form-data; boundary=boundary
Content-Length: 514

--boundary
Content-Disposition: form-data; name="file"
Content-Type: image/jpeg

[JPEG bytes]
--boundary--
```
For iOS, this doc may help : https://newfivefour.com/swift-form-data-multipart-upload-URLRequest.html
- Response will contain all fields from Cloud Storage : 
```
{
    "status_code": 0,
    "data": {
        "kind": "storage#object",
        "id": "foodbodi-photo/-1563106947575/1563106947778475",
        "selfLink": "https://www.googleapis.com/storage/v1/b/foodbodi-photo/o/-1563106947575",
        "name": "-1563106947575",
        "bucket": "foodbodi-photo",
        "generation": "1563106947778475",
        "metageneration": "1",
        "contentType": "image/jpeg",
        "timeCreated": "2019-07-14T12:22:27.778Z",
        "updated": "2019-07-14T12:22:27.778Z",
        "storageClass": "MULTI_REGIONAL",
        "timeStorageClassUpdated": "2019-07-14T12:22:27.778Z",
        "size": "46678",
        "md5Hash": "0gxxmAwhIlUxE0tq0ZOrUg==",
        
        "mediaLink": "https://www.googleapis.com/download/storage/v1/b/foodbodi-photo/o/-1563106947575?generation=1563106947778475&alt=media",
       
        "contentEncoding": "gzip",
        "crc32c": "NS/wqw==",
        "etag": "CKuP+ZKztOMCEAE="
    }
}
```
Get the <b>"mediaLink"</b>. This is the url for the photo.
Example : 
```
<img src="https://www.googleapis.com/download/storage/v1/b/foodbodi-photo/o/-1563106947575?generation=1563106947778475&alt=media">
```
Submit that <b>mediaLink</b> as "photo" field in restaurant / food api

#### Chat 

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
    geohash : GeoHash
    open_hour : String (format HH:mm),
    close_hour : String (format HH:mm,
    calo_values : [Numbers],
    license : {
        "business_name": "Chicken bbq 2", (required)
        "license_photo" : "_license_photo", (required)
        "registration_number" : "CHICKEN111", (required)
        "principle_place" : "Somewhere in the Earth", (required)
        "proprietors" : ["Mickey", "Jonathan"], (required)
    }
    
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
### Comment

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

    RESTAURANT_NOT_FOUND : 310,
    RESTAURANT_CREATE_FAIL : 311,
    CREATE_FOOD_FAIL : 312,
    FOOD_NOT_FOUND : 313,

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

### Get restaurant
- GET/api/restaurant/{restaurant_id}
- Output (if success)
```
{
    status_code : 0,
    data : {
        restaurant : {...Restaurant data},    
    }
    
}
```

### List food by restaurant id
- GET /api/restaurant/{restaurant_id}/foods
- Require token 
- Output if success 
```
{
    status_code : 0,
    data : {
        foods : [Array of food]
    }
}

```

Example :
```
{
    "status_code": 0,
    "data": {
        "foods": [
            {
                "name": "Food1",
                "restaurant_id": "nO5DDNgbqCp2HvoJAaEw",
                "creator": "y@test.com",
                "calo": null,
                "price": null,
                "description": null,
                "created_date": {
                    "_seconds": 1562425080,
                    "_nanoseconds": 988000000
                },
                "id": "aWG7nmUa55TZFzOxSMB1"
            }
        ]
    }
}
```

### GET /api/restaurant/list
- Not require token
- List all restaurant in db, now use for testing
- Output example 
```
{
    "status_code": 0,
    "data": {
        "restaurants": [
            {
                "name": "R3",
                "creator": "y@test.com",
                "address": "NOwhee",
                "category": "ORDINARY",
                "type": "FOOD_TRUCK",
                "lat": null,
                "lng": null,
                "menu": [],
                "geohash": "s0000",
                "open_hour": null,
                "close_hour": null,
                "priority": 10,
                "id": "AsssHSf2tUf6C0runFr5"
            },
            {
                "name": "R2",
                "creator": "y@test.com",
                "address": "NOwhee",
                "category": "ORDINARY",
                "type": "FOOD_TRUCK",
                "lat": null,
                "lng": null,
                "menu": [],
                "geohash": "s0000",
                "open_hour": null,
                "close_hour": null,
                "priority": 10,
                "id": "r0fbkfiIakRKL5sx582d"
            }
        ]
    }
}
```
### Create restaurant
- POST/api/restaurant
- Require token in header
- Input
```$xslt
{
    ...Restaurant data
    foods : [{...Food data}] //Array of a food. Food in this array will be added to restaurant's menu,
    license : {
        "business_name": "Chicken bbq 2", (required)
        "license_photo" : "_license_photo", (required)
        "registration_number" : "CHICKEN111", (required)
        "principle_place" : "Somewhere in the Earth", (required)
        "proprietors" : ["Mickey", "Jonathan"], (required)
    }
}
```
- Output (if success)
```
{
    status_code : 0,
    data : {
        restaurant: {...Restaurant data,
            license : {...License}
        
        },
    }
}
```

### Update restaurant
- PUT/api/restaurant/{restaurant_id}
- Require token in header
- Input : Same as POST/api/restaurant , except field ```foods```
- Output : 
```
{
    status_code : 0
}

```
### Delete restaurant
- DELETE/api/restaurant/{restaurant_id}
- Require token in header
- Output (if success)
```
{
    status_code : 0
}

```
### Create food
- POST/api/food
- Require token in header
- Input
```$xslt
{
    
        "name": "asd", (required)
        "restaurant_id": "LzuwD89FeatgBzbnQZ6E", (required)
        "calo": 200, (required)
        "price": 600,
        "description": "dsad"
    
}
```
- Output (if success)
```
{
    "status_code": 0,
    "data": {
        "name": "asd",
        "restaurant_id": "LzuwD89FeatgBzbnQZ6E",
        "creator": "long@gmail.com",
        "calo": 200,
        "price": 600,
        "descript": "dsad",
        "id": "XFhfBf784EMCHz2tyE6I"
    }
}
```

### Import foods
- POST /api/food/import
- To add many foods as once
- Require header token
- Input 
```
   {
    restaurant_id : String (required),
    foods :[
        {
            "name" : "Food1"
            ...other fields
        }
    ]
   }
```
### Get food
- GET/api/food/{food_id}
- Require token in header
- Output (if success)
```
{
    "status_code": 0,
    "data": {
        "name": "asd",
        "restaurant_id": "LzuwD89FeatgBzbnQZ6E", 
        "creator": "long@gmail.com",
        "calo": 200,
        "price": 600,
        "descript": "dsad",
        "id": "XFhfBf784EMCHz2tyE6I"
    }
}
```
### Search food
- GET/api/food/search?restaurant={restaurant_id}&name={food_name}&calogt={number of calo greater than}&calolt={number of calo less than}&pricegt={number of price greater than}&pricelt={number of price less than}
- Require token in header
- Output (if success)
```
{
    "status_code": 0,
    "data": [{
        "name": "asd",
        "restaurant_id": "LzuwD89FeatgBzbnQZ6E",
        "creator": "long@gmail.com",
        "calo": 200,
        "price": 600,
        "descript": "dsad",
        "id": "XFhfBf784EMCHz2tyE6I"
    },{
        "name": "asd",
        "restaurant_id": "LzuwD89FeatgBzbnQZ6E",
        "creator": "long@gmail.com",
        "calo": 200,
        "price": 600,
        "descript": "dsad",
        "id": "XFhfBf784EMCHz2tyE6I"
    },...]
}
```
### Update food
- PUT/api/food/{food_id}
- Require token in header
- Input : Same as [POST/api/food](#create-food), ```restaurant_id``` is <b>required</b> in the request body
- Output : 
```
{
    status_code : 0
}

```
### Delete food
- DELETE/api/food/{food_id}?restaurant_id={restaurant_id}
- Require token in header
- Output (if success)
```
{
    status_code : 0
}

```
### List restaurant category
- GET /api/metadata/restaurant_category 
- No token required
- Return supported restaurant categories on server
```
{
    "status_code": 0,
    "data": {
        "ORDINARY": {
            "key": "ORDINARY",
            "name": "Ordinary"
        },
        "FAST_FOOD": {
            "key": "FAST_FOOD",
            "name": "Fast food"
        }
    }
}
```
### Get restaurant type
- GET /api/metadata/restaurant_type
- No token required
- Return all types of restaurant supported on server
```
{
    "status_code": 0,
    "data": {
        "RESTAURANT": {
            "key": "RESTAURANT",
            "name": "Restaurant"
        },
        "FOOD_TRUCK": {
            "key": "FOOD_TRUCK",
            "name": "Food Truck"
        }
    }
}
```

### Approve license
- <b>Require manager token </b>
- <b>GET /api/license/approve?id={license_id}</b>
- After a license is approved, the restaurant related to the license will be populated 
- Output : field License.status will be set to "APPROVED". Return as a web page

### Deny license
- <b>Require manager token </b>
- <b>GET /api/license/deny?id={license_id}</b>
- After a license is approved, the restaurant related to the license will be populated 
- Output : field License.status will be set to "DENIED". Return as a web page


### Add comment
- Require token
- <b>POST /api/comment</b>
- Input
```
{
   "restaurant_id" : <String> (required)
   "message" : <String> (required)
}
```
- Output
```
{
    status_code : 0,
    data :{
     "restaurant_id" : <String> 
     "message" : <String>
     "author" : <String> 
     "created_date" : <Date>
  }

```

### Get comments
- Require token
- <b>GET /api/comment/list?restaurant_id={restaurant_id}</b>
- Output : 
```
{
    status_code : 0,
    data : {
        comments : [Array of comments]
        next_page_token : <String>
    }
}
```
- As default, this api will return lasted 50 comments. To get next comments, add a cursor in the query : 
 <b>GET /api/comment/list?restaurant_id={restaurant_id}&cursor={next_page_token}</b>
