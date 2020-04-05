import React from "react"
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import AppController from "./AppController";
import AppSections from "./AppSections";

class Appbar extends React.Component{
    constructor(props) {
        super(props);
        this.goRestaurant = this.goRestaurant.bind(this);
        this.goContributor = this.goContributor.bind(this);

    }

    render() {
        return (
            <div>
                <Paper>
                    <Box p={1}>
                        <Button color="primary" onClick={this.goRestaurant}> Restaurants </Button>
                        <Button color="primary" onClick={this.goContributor}> Contributors </Button>
                    </Box>
                </Paper>
            </div>
        );
    }

    goRestaurant() {
        AppController.setSection(null);
    }

    goContributor() {
        AppController.setSection(AppSections.LIST_CONTRIBUTORS);
    }

}

export default Appbar;