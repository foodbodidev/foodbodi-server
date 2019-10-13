import React from "react";
import FormControl from '@material-ui/core/FormControl';
import Restaurant from "../../src/server/models/restaurant";
import RestaraurantType from "../../src/server/models/restaurant_type";
import RestaraurantCategory from "../../src/server/models/restaurant_category";
import RemoteCall from "./utils/RemoteCall";
import {Typography} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from "@material-ui/core/Container";
import License from "../../src/server/models/license";



class EditRestaurantView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: new Restaurant({}),
            error: null,
            restaurant_id : this.props.restaurant_id
        };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);

        this.style = {
            container: {
                display: 'flex',
                flexWrap: 'wrap',
            },
            textField: {
                marginLeft: "10px",
                marginRight: "10px"
            },
            dense: {
                marginTop: "10px"
            },
            menu: {
                width: 200,
            },
            error : {
                color : "red"
            }
        }

    }

    componentDidMount() {
        if (!!this.props.restaurant_id) {
            new RemoteCall("/api/restaurant/" + this.props.restaurant_id)
                .useGET()
                .useJson()
                .onJsonResponse(json => {
                    this.setState({
                        restaurant : new Restaurant(json.data.restaurant, this.props.restaurant_id),
                        error : null
                    })
                }).onError(error => {
                    this.setState({
                        error : error.message
                    })
            }).execute()
        }
    }

    renderTitle() {
        return (
            <Typography variant="h5">{!!this.state.restaurant_id ? "Edit" : "Add" }</Typography>
        )
    }

    renderError() {
        return (
            <Typography variant="caption" style={this.style.error}> {this.state.error} </Typography>
        )
    }

    render() {
        return (
            <Container>
                <Paper>
                    {this.renderTitle()}
                <form style={this.style.container} autoComplete="off">
                    <TextField
                        id="name"
                        style={this.style.textField}
                        label="Name"
                        value={this.state.restaurant.name()}
                        onChange={this.handleChange('name')}
                        margin="normal"
                        variant="filled"
                    />
                    <TextField
                        id="address"
                        style={this.style.textField}
                        label="Address"
                        value={this.state.restaurant.address()}
                        onChange={this.handleChange('address')}
                        margin="normal"
                        variant="filled"
                    />
                    <TextField
                        id="open_hour"
                        style={this.style.textField}

                        label="Open hour"
                        value={this.state.restaurant.openHour()}
                        onChange={this.handleChange('open_hour')}
                        margin="normal"
                        variant="filled"
                    />
                    <TextField
                        id="close_hour"
                        style={this.style.textField}

                        label="Close hour"
                        value={this.state.restaurant.closeHour()}
                        onChange={this.handleChange('close_hour')}
                        margin="normal"
                        variant="filled"
                    />
                    <TextField
                        id="type"
                        style={this.style.textField}

                        select
                        label="Type"
                        value={this.state.restaurant.type()}
                        onChange={this.handleChange('type')}
                        SelectProps={{
                            native: true,
                        }}
                        helperText="Restaurant type"
                        margin="normal"
                        variant="filled"
                    >
                        {Object.values(RestaraurantType).map(option => (
                            <option key={option.key} value={option.key}>
                                {option.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        id="category"
                        style={this.style.textField}

                        select
                        label="Category"
                        value={this.state.restaurant.category()}
                        onChange={this.handleChange('category')}
                        SelectProps={{
                            native: true,
                        }}
                        helperText="Restaurant category"
                        margin="normal"
                        variant="filled"
                    >
                        {Object.values(RestaraurantCategory).map(option => (
                            <option key={option.key} value={option.key}>
                                {option.name}
                            </option>
                        ))}
                    </TextField>
                </form>
                    <div>
                        {this.state.error !== null ? this.renderError() : ""}
                    </div>
                    <Button onClick={this.submit} variant="contained" color="primary"> Submit </Button>
                    <Button onClick={this.cancel} variant="contained" color="default"> Cancel </Button>
                </Paper>
            </Container>
        );
    }

    handleChange(fieldName) {
        return (e) => {
            let data = e.target.value;
            let restaurant =  this.state.restaurant;
            restaurant.values[fieldName] = data;
            this.setState({
                restaurant : restaurant
            });
        }
    }

    submit(e) {
        const json = this.state.restaurant.toJSON();
        if (!!json.license && !!json.license.registration_number && !Array.isArray(json.license.representative_name)) {

        } else {
            json.license = {
                registration_number: "*",
                representative_name: ["*"]
            };
        }

        if (!!this.state.restaurant_id) {
            new RemoteCall("/api/restaurant/" + this.state.restaurant_id)
                .usePUT()
                .useJson()
                .setBody(json)
                .onJsonResponse(json => {
                    if (0 === json.status_code) {
                        if (this.props.onSubmitted) {
                            this.props.onSubmitted(json)
                        }
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
            new RemoteCall("/api/restaurant")
                .usePOST()
                .useJson()
                .setBody(json)
                .onJsonResponse(json => {
                    if (0 === json.status_code) {
                        if (this.props.onSubmitted) {
                            this.props.onSubmitted(json)
                        }
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
        }
    }

    cancel(e) {
        if (this.props.onCancelled) {
            this.props.onCancelled()
        }
    }

}

export default EditRestaurantView