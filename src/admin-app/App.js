import React from "react";
import RestaurantList from "./RestaurantList";
import {Container} from "@material-ui/core";
import LoginForm from "./LoginForm";
import RemoteCall from "./utils/RemoteCall";
import firebase from "firebase";
import AppSections from "./AppSections";
import ContributorForm from "./ContributorForm";
import AppController from "./AppController";
import Appbar from "./Appbar";
import ContributorList from "./ContributorList";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token : null,
            section : null,
            section_data : {}
        };

        this.onLogin = this.onLogin.bind(this);

        AppController.setInstance(this);

    }

    render() {
        return (
            <div>
            {!!this.state.token ? this.renderApp() : this.renderLogin()}
            </div>
        )
    }

    renderApp() {
        let section = (<RestaurantList/>);
        if (AppSections.ADD_CONTRIBUTOR === this.state.section) {
            section = (<ContributorForm/>)
        } else if (AppSections.EDIT_CONTRIBUTOR === this.state.section) {
            section = (<ContributorForm data={this.state.section_data}/>)
        } else if (AppSections.LIST_CONTRIBUTORS === this.state.section) {
            section = (<ContributorList/>)
        } else if (AppSections.CONTRIBUTIONS === this.state.section) {
            section = (<RestaurantList contributor={this.state.section_data}/>)
        }
        else if (AppSections.PROFILE === this.state.section) {
            //...
        }

        return (
            <div style={{backgroundColor : "whitesmoke", height : "max-content", minHeight : "100%"}}>
                <Appbar/>
                <Container fixed>
                    {section}
                </Container>
            </div>
        );
    }

    renderLogin() {
        return (
            <div>
                <LoginForm onLoginOK={this.onLogin}></LoginForm>
            </div>
        )
    }

    onLogin(json) {
        const token = json.data.token;
        RemoteCall.setApiToken(token);
        this.setState({
            token : token
        });
    }

    componentDidMount() {
        firebase.initializeApp({
            apiKey: "AIzaSyByO24envfd_yrRrT-HNhMf2gNrkBQBJbk",
            authDomain: "foodbodi-prod.firebaseapp.com",
            databaseURL: "https://foodbodi-prod.firebaseio.com",
            projectId: "foodbodi-prod",
            storageBucket: "foodbodi-prod.appspot.com",
            messagingSenderId: "367920415756",
            appId: "1:367920415756:web:76bc8490eb028873c39a29",
            measurementId: "G-2W09WZ3P4R"
        });
    }
}

export default App