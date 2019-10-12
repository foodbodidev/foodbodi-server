import React from "react"
import {Container, TextField} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import RemoteCall from "./utils/RemoteCall";
import Button from '@material-ui/core/Button';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.state = {
            username : null,
            password : null
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <Paper>
                        <Typography variant="h5">Login</Typography>
                        <TextField
                            id="username"
                            label="Username"
                            value={this.state.username}
                            onChange={this.handleChange('username')}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            id="password"
                            label="Password"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            margin="normal"
                            variant="outlined"
                        />
                        <div>
                        {!!this.state.error ? (<Typography variant="caption">{this.state.error}</Typography>) : null}
                        </div>
                        <Button onClick={this.login}> Submit </Button>
                    </Paper>

                </Container>
            </div>
        );
    }

    login() {
        let json = {
            email : this.state.username,
            password : this.state.password
        };
        new RemoteCall("/api/login")
            .useJson()
            .usePOST()
            .setBody(json)
            .onJsonResponse(json => {
                if (0 === json.status_code) {
                    this.props.onLoginOK(json)
                } else {
                    this.setState({
                        error : json.message
                    })
                }
            }).onError(error => {
                this.setState({
                    error : error.message
                })
        })
            .execute()
    }

    handleChange(field) {
        return (e) => {
            this.state[field] = e.target.value;
            this.setState();
        }
    }

}

export default LoginForm