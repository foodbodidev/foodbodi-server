import React from "react"
import {Container, TextField} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import RemoteCall from "./utils/RemoteCall";
import AppController from "./AppController";
import AppSections from "./AppSections";

class ContributorForm extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.style = {
            container: {
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: "100px",
            },
            textField: {
                marginTop: "10px"
            },
            centerBox: {
                marginRight: "auto",
                marginLeft: "auto",
                width : "600px",
                padding : "2em"
            },
            error : {
                color : "red"
            }
        };
        let data = props.data || {};
        this.state = {
            email : data.email || null,
            password : data.password || null,
            first_name : data.first_name || null,
            last_name : data.last_name || null,
            _id : data._id || null
        }
    }

    render() {
        let title = !!this.state._id ? "Edit " + this.state.email : "New Contributor";
        return (
            <div>
                <Container style={this.style.container}>
                    <Paper style={this.style.centerBox}>
                        <Typography variant="h5">{title}</Typography>
                        <div>
                        <TextField
                            id="email"
                            fullWidth
                            label="Username"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            margin="normal"
                            variant="outlined"
                            style={this.style.textField}
                        />
                        </div>
                        <div>
                        <TextField
                            id="password"
                            label="Password"
                            fullWidth
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            margin="normal"
                            variant="outlined"
                            style={this.style.textField}
                        />
                        </div>
                        <div>
                            <TextField
                                id="first_name"
                                label="First name"
                                fullWidth
                                value={this.state.first_name}
                                onChange={this.handleChange('first_name')}
                                margin="normal"
                                variant="outlined"
                                style={this.style.textField}
                            />
                        </div>
                        <div>
                            <TextField
                                id="last_name"
                                label="Last name"
                                fullWidth
                                value={this.state.last_name}
                                onChange={this.handleChange('last_name')}
                                margin="normal"
                                variant="outlined"
                                style={this.style.textField}
                            />
                        </div>
                        <div>
                            {!!this.state.error ? (<Typography variant="caption" style={this.style.error}>{this.state.error}</Typography>) : null}
                        </div>
                        <Button onClick={this.submit} variant="contained" color="primary"> Submit </Button>
                    </Paper>

                </Container>
            </div>
        );
    }

    submit() {
        let url = !!this.state._id ? "/api/update_contributor?id=" + this.state._id : "/api/add_contributor";
        new RemoteCall(url)
            .useJson()
            .usePOST()
            .setBody({
                email:  this.state.email,
                password : this.state.password,
                first_name : this.state.first_name,
                last_name : this.state.last_name,
                _id : this.state._id
            }).onJsonResponse(json => {
                if (json.status_code === 0) {
                    AppController.setSection(AppSections.LIST_CONTRIBUTORS);
                } else {
                    this.setState({
                        error : json.message
                    })
                }
        }).onError(error => {
            this.setState({
                error : error.message
            })
        }).execute();
    }

    handleChange(field) {
        return (e) => {
            this.state[field] = e.target.value;
            this.setState();
        }
    }

}

export default ContributorForm