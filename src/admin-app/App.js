import React from "react";
import RestaurantList from "./RestaurantList";
import {Container} from "@material-ui/core";
import LoginForm from "./LoginForm";
import RemoteCall from "./utils/RemoteCall";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token : null
        }

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
}

export default App