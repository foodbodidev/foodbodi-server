import AbstractModel from "./AbstractModel";
import firebaseAdmin from "firebase-admin";
class Restaurant extends AbstractModel {
    constructor(input, id) {
        super(input);
        this._name = input.name || null;
        this._creator = input.creator || null;
        this._address = input.address || null;
        this._location = input.location || null;
        if (!this._location && !!input.lat && !!input.lng) {
            this.location(input.lat, input.lng);
        }
        this._type = input.type || "RESTAURANT";

        if (id) {
            this._id = id;
        }
    }

    name(value) {
        if (value) {
            this._name = value;
        }
        return this._name;

    }

    address(value) {
        if (value) {
            this._address = value;
        }
        return this._address;

    }


    creator(value) {
        if (value) {
            this._creator = value;
        }
        return this._creator;

    }

    location(lat, lng) {
        if (!!lat && !!lng) {
            const point = new firebaseAdmin.firestore.GeoPoint(lat, lng);
            this._location = point;
        }
        return this._location;
    }

    type(value) {
        if (value) {
            this._type = value;
        }
        return this._type;
    }

    toJSON() {
        return {
            id : this._id,
            name : this._name,
            creator : this._creator,
            address : this._address,
            location : this._location
        }
    }

    collectionName() {
        return "restaurants";
    }

}

export default Restaurant;