import React from "react";
import RestaurantList from "./RestaurantList";
import {Container} from "@material-ui/core";
import LoginForm from "./LoginForm";
import RemoteCall from "./utils/RemoteCall";
import firebase from "firebase";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token : null
        };

        this.onLogin = this.onLogin.bind(this);
    }

    render() {
        return (
            <div>
            {!!this.state.token ? this.renderApp() : this.renderLogin()}
            </div>
        )
    }

    renderApp() {
        return (
            <div>
                <Container fixed>
                    <RestaurantList></RestaurantList>
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