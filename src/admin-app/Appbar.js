import React from "react"
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import AppController from "./AppController";
import AppSections from "./AppSections";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

class Appbar extends React.Component{
    constructor(props) {
        super(props);
        this.goRestaurant = this.goRestaurant.bind(this);
        this.goContributor = this.goContributor.bind(this);

        this.styles = {
            selected : {
                display : "inline",
                backgroundColor: "lightgreen"
            },
            unselected : {
                display : "inline",
                backgroundColor: "green"
            }
        }}

    render() {
        let currentSection = AppController.getCurrentSection();
        let isRestaurantTab = AppSections.LIST_CONTRIBUTORS !== currentSection;
        let isContributorTab = AppSections.LIST_CONTRIBUTORS === currentSection;
        let tabIndex = 0;
        return (
            <div style={{backgroundColor : "green", color : "white"}}>
                <Tabs values={tabIndex}>
                    <Tab label={"Restaurants"} onClick={this.goRestaurant}/>
                    <Tab label={"Contributors"} onClick={this.goContributor}/>
                </Tabs>
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