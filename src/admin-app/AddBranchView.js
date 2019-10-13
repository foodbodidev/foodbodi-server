import React from "react";
import EditRestaurantView from "./EditRestaurantView";
import RemoteCall from "./utils/RemoteCall";
import Restaurant from "../server/models/restaurant";
import {Typography} from "@material-ui/core";

class AddBranchView extends EditRestaurantView{
    constructor(props) {
        super(props);

        this.state.origin_restaurant = null;
    }

    componentDidMount() {
        if (!!this.props.restaurant_id) {
            new RemoteCall("/api/restaurant/" + this.props.restaurant_id)
                .useGET()
                .useJson()
                .onJsonResponse(json => {
                    if (0 === json.status_code) {
                        let origin = new Restaurant(json.data.restaurant);
                        let newRestaurant = new Restaurant(json.data.restaurant);
                        newRestaurant.address("");
                        newRestaurant.name("");
                        if (!!origin.isBranchOf()) {
                            newRestaurant.isBranchOf(origin.isBranchOf());
                        } else {
                            newRestaurant.isBranchOf(this.props.restaurant_id);
                        }
                        this.setState({
                            origin_restaurant : origin,
                            error: null,
                            restaurant_id : null,
                            restaurant : newRestaurant
                        })
                    } else {
                        this.setState({
                            error : json.message
                        })
                    }
                }).onError(error => {
                this.setState({
                    error : error.message
                })
            }).execute()
        } else {
            this.setState({
                error : "Missing restaurant id when open view"
            })
        }
    }

    renderTitle() {
        return (
            <div>
                {this.state.origin_restaurant !== null ? (
                    <div>
                    <Typography variant="h5"> Add a branch of {this.state.origin_restaurant.name()} </Typography>
                    <Typography variant="caption"> Dishes of this restaurant will be the same as {this.state.origin_restaurant.name()} ones</Typography>
                    </div>
                ) : <Typography variant="caption">Loading...</Typography>}

            </div>
        )
    }



}

export default AddBranchView