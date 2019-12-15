import React from "react";
import RemoteCall from "./utils/RemoteCall";
import {TableRow, TextField} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import Food from "../../src/server/models/food";
import Button from '@material-ui/core/Button';
import {Typography} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import ImageGallery from "./ImageGallery";


class FoodsView extends React.Component{
    constructor(props) {
        super(props);

        this.restaurant_id = this.props.restaurant.getFoodRestaurantId();

        this.actions = {
            UPLOAD_FOOD_PHOTO : 1,
            NONE : 0
        };
        this.state = {
            items : [],
            error : null,
            food: new Food({}),
            openModal : false,
            editing_id : null,
            action : this.actions.NONE
        };

        this.add = this.add.bind(this);
        this.cancel = this.cancel.bind(this);
        this.cancelUploadPhoto = this.cancelUploadPhoto.bind(this);
        this.updateFoodPhoto = this.updateFoodPhoto.bind(this);
        this.uploadFoodPhoto = this.uploadFoodPhoto.bind(this);

    }

    componentDidMount() {
        new RemoteCall("/api/restaurant/" + this.restaurant_id + "/foods")
            .useJson()
            .useGET()
            .onJsonResponse(json => {
                if (0 === json.status_code) {
                    let items = json.data.foods || []
                    this.setState({
                        error : null,
                        items : items
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
    }

    renderRow(item) {
        return (
                <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                        {item.name}
                    </TableCell>
                    <TableCell>
                        $ {item.price}
                    </TableCell>
                    <TableCell>
                        {item.calo} kcalo
                    </TableCell>
                    <TableCell>
                        <img onClick={this.updateFoodPhoto(item.id)} src={item.photo || "https://via.placeholder.com/50x50"} style={{height : "50px", width : "50"}}/>
                    </TableCell>
                    <TableCell>
                        <Button onClick={this.delete(item.id)}>Delete</Button>
                    </TableCell>
                </TableRow>
        )
    }

    renderRows() {
        let rows = this.state.items.map(item => this.renderRow(item))
        return (
            <div>
                {rows}
            </div>
        )
    }

    renderError() {
        return (
            <Typography variant="caption" style={{color : "red"}}>{this.state.error}</Typography>
        )
    }

    getEditingFood() {
        return this.state.items.find(item => item.id === this.state.editing_id);
    }

    render() {
        let popup = null;
        let editingFood = this.getEditingFood();
        if (this.state.action === this.actions.UPLOAD_FOOD_PHOTO) {
            popup = (<ImageGallery onUploaded={this.uploadFoodPhoto} onCancelled={this.cancelUploadPhoto} image_urls={[editingFood.photo]} selected_image={editingFood.photo} />)
        }
        return (
            <Container fixed>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.action !== this.actions.NONE}
                    onClose={this.modalClose}
                >
                    <div>
                        {popup}
                    </div>
                </Modal>
                <Paper style={{height: "800px", overflowY : "scroll"}}>
                    <Typography variant="h5"> Dishes of {this.props.restaurant.name()}</Typography>
                    <div>
                        <Typography variant="h6"> Add new dishes</Typography>
                        <form>
                            <TextField
                                id="name"
                                label="Name"
                                value={this.state.food.name()}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="price"
                                label="Price $"
                                type="number"
                                value={this.state.food.price()}
                                onChange={this.handleChange('price')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="calo"
                                label="KCalo"
                                type="number"
                                value={this.state.food.calo()}
                                onChange={this.handleChange('calo')}
                                margin="normal"
                                variant="outlined"
                            />
                        </form>
                        <div>
                            {this.state.error !== null ? this.renderError() : ""}
                        </div>
                        <Button onClick={this.add} variant="contained" color="primary">Add</Button>
                        <Button onClick={this.cancel} variant="contained" color="default">Cancel</Button>

                    </div>
                    <Typography variant="h5"> List of dishes </Typography>

                    <Table >
                        <TableBody>
                            {this.renderRows()}
                        </TableBody>
                        <TableFooter>
                        </TableFooter>
                </Table>
                </Paper>
            </Container>
        );
    }

    handleChange(name) {
        return (e) => {
            //TODO : convert food to new kind of model
            if (name === "name") {
                this.state.food.name(e.target.value)
            } else if (name === "price") {
                this.state.food.price(Number.parseFloat(e.target.value))
            } else if (name === "calo") {
                this.state.food.calo(Number.parseFloat(e.target.value))
            }

        }
    }

    add() {
        let food = this.state.food.toJSON();
        food.restaurant_id = this.restaurant_id;
        new RemoteCall("/api/food")
            .useJson()
            .usePOST()
            .setBody(food)
            .onJsonResponse(json => {
                if (0 === json.status_code) {
                    this.refresh();
                } else {
                    this.setState({
                        error : json.message
                    })
                }
            }).onError(error => {
            this.setState({
                error : json.message
            })
        }).execute()

    }

    cancel() {
        this.props.onCancelled()
    }

    cancelUploadPhoto() {
        this.setState({
            editing_id : null,
            action : this.actions.NONE
        })
    }

    delete(id) {
        return (e) => {
            new RemoteCall("/api/food/" + id + "?restaurant_id=" + this.restaurant_id)
                .useJson()
                .useDELETE()
                .onJsonResponse(json => {
                    if (0 === json.status_code) {
                        this.refresh()
                    } else {
                        this.setState({
                            error : json.message
                        })
                    }
                }).onError(error => {
                this.setState({
                    error : json.message
                })
            }).execute()
        }
    }

    refresh() {
        new RemoteCall("/api/restaurant/" + this.restaurant_id + "/foods")
            .useJson()
            .useGET()
            .onJsonResponse(json => {
                if (0 === json.status_code) {
                    let items = json.data.foods || [];
                    this.setState({
                        error : null,
                        items : items,
                        food : new Food({})
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
    }

    updateFoodPhoto(id) {
        return (e) => {
            this.setState({
                editing_id : id,
                action : this.actions.UPLOAD_FOOD_PHOTO
            })
        }
    }

    uploadFoodPhoto(data) {
        const link = data.mediaLink;
        new RemoteCall("/api/food/" + this.state.editing_id)
            .usePUT()
            .useJson()
            .setBody({photo : link, restaurant_id : this.restaurant_id})
            .onJsonResponse(json => {
                if (0 === json.status_code) {
                    let editingFood = this.getEditingFood();
                    editingFood.photo = link;
                    this.setState(this.state)
                } else {
                    this.setState({error : json.message})
                }
            }).onError(error => {
                this.setState({error : error.message})
        }).execute()
    }

}

export default FoodsView