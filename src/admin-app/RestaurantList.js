import React from "react";
import RemoteCall from "./utils/RemoteCall";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Button from '@material-ui/core/Button';
import {Typography} from "@material-ui/core";
import EditRestaurantView from "./EditRestaurantView";
import Modal from '@material-ui/core/Modal';
import AddBranchView from "./AddBranchView";
import FoodsView from "./FoodsView";
import Restaurant from ".././server/models/restaurant"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ImageGallery from "./ImageGallery";


class RestaurantList extends React.Component{
    constructor(props) {
        super(props);

        this.action = {
            ADD : 0,
            EDIT : 1,
            CLONE : 2,
            SHOW_FOOD : 3,
            PHOTO : 4,
            NONE : -1,
        };

        this.state = {
            items : [],
            error : null,
            pageTokens : [],
            action : this.action.NONE,
            editing_id : null,
            restaurant : null
        };

       // this.delete = this.delete.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.backPage = this.backPage.bind(this);
        this.add = this.add.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.onSubmitted = this.onSubmitted.bind(this);
        this.refreshFromBeginning = this.refreshFromBeginning.bind(this);
        this.openPhotoView = this.openPhotoView.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);

        this.modalStyles = {
            paper: {
                marginTop : "100px"
            },
        }

    }

    componentDidMount() {
        new RemoteCall("/api/restaurant/list")
            .useJson()
            .useGET()
            .onJsonResponse(json => {
                const list = json.data.restaurants || [];
                this.updateRestaurantList(list, json.data.nextPageToken)
            }).onError(error => {
                this.showError(error.message)
        }).execute()
    }

    getEditingRestaurant() {
        return this.state.items.find(item => item.id === this.state.editing_id);
    }
    render() {
        let popup = null;
        let editing = this.getEditingRestaurant();
        let photo = !!editing && Array.isArray(editing.photos) ? editing.photos[0] : null
        if (this.action.CLONE === this.state.action) popup = (<AddBranchView restaurant_id={this.state.editing_id} onSubmitted={this.onSubmitted} onCancelled={this.modalClose}/>)
        else if (this.action.SHOW_FOOD === this.state.action) popup = (<FoodsView restaurant={this.state.restaurant} onCancelled={this.modalClose}/>);
        else if (this.action.EDIT === this.state.action) popup = (<EditRestaurantView restaurant_id={this.state.editing_id} onSubmitted={this.onSubmitted} onCancelled={this.modalClose}/>)
        else if (this.action.PHOTO === this.state.action) popup =(<ImageGallery onUploaded={this.uploadPhoto} onCancelled={this.modalClose} image_urls={this.getEditingRestaurant().photos} selected_image={photo}/>);
        return (
            <div>

                {this.state.error !== null ? this.renderError() : ""}


                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.action !== this.action.NONE}
                    onClose={this.modalClose}
                >
                    <div style={this.modalStyles.paper}>
                        {popup}
                    </div>
                </Modal>
                <Typography variant="h6"> Restaurants </Typography>
                <div>
                    <Button onClick={this.add} variant="outlined" color="primary">Add</Button>
                    <Button onClick={this.refreshFromBeginning} variant="outlined"> Refresh</Button>
                </div>
                {this.renderRows()}
            </div>
        );
    }

    renderError() {
        return (
            <Typography variant="caption" display="block" style={{color: "red"}}>{this.state.error}</Typography>
        )
    }

    renderRow(item) {
        return (<div>

        </div>)
    }

    renderRows() {
        let rows = this.state.items.map(item => (
            <TableRow>
                <TableCell>
                    {item.name}
                    <div>
                        {!!item.is_branch_of ? (<h6>Branch</h6>) : ""}
                    </div>
                    <div>
                    <Button onClick={this.showFoods(item.id)} variant="contained" color="primary">Foods</Button>
                        <Button onClick={this.edit(item.id)} data={item.id} variant="outlined" color="default">
                            Edit
                        </Button>
                    </div>
                </TableCell>
                <TableCell>{item.address}
                    <div>
                        LatLng : {item.lat}:{item.lng}
                    </div>
                    <div>
                        Geohash : {item.geohash}
                    </div>
                <div>
                    <Button onClick={this.addBranch(item.id)} data={item.id} variant="outlined" color="primary">
                        Add Branch
                    </Button>
                    <Button onClick={this.openPhotoView(item.id)}>Photos</Button>
                </div>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.open_hour} ~ {item.close_hour}</TableCell>
                <TableCell>
                    <Button onClick={this.delete(item.id)} data={item.id} variant="outlined" color="secondary"> Delete </Button>
                </TableCell>
            </TableRow>


        ));

        return (
            <Paper>
                <div>
                    <Table>
                        <TableBody>
                            {rows}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <div>
                                    <IconButton onClick={this.backPage} aria-label="previous page">
                                        <KeyboardArrowLeft />
                                    </IconButton>
                                    <IconButton
                                        onClick={this.nextPage}
                                        aria-label="next page"
                                    >
                                         <KeyboardArrowRight />
                                    </IconButton>

                                </div>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </Paper>
        )
    }

    getLastPageToken() {
        if (this.state.pageTokens.length >0 ) {
            return this.state.pageTokens[this.state.pageTokens.length - 1];
        }
        return null;
    }

    getPreviousPageToken() {
        if (this.state.pageTokens.length > 1 ) {
            let lastToken = this.getLastPageToken();
            let currentToken = this.state.pageTokens[this.state.pageTokens.length - 2];
            let removedLast = this.state.pageTokens.filter(item => item !== lastToken && item !== currentToken);
            this.state.pageTokens = removedLast;
        }
        return this.getLastPageToken();
    }

    getCurrentPageToken() {
        if (this.state.pageTokens.length > 1 ) {
            return this.state.pageTokens[this.state.pageTokens.length - 2];
        }
        return null;
    }

    nextPage() {
        new RemoteCall("/api/restaurant/list?nextPageToken=" + this.getLastPageToken())
            .useJson()
            .useGET()
            .onJsonResponse(json => {
                const items = json.data.restaurants || [];
                const nextToken = json.data.nextPageToken;
                this.updateRestaurantList(items, nextToken)
            }).onError(error => {
            this.showError(error.message)
        }).execute()
    };
    backPage() {
        new RemoteCall("/api/restaurant/list?nextPageToken=" + this.getPreviousPageToken())
            .useJson()
            .useGET()
            .onJsonResponse(json => {
                const items = json.data.restaurants || [];
                const nextToken = json.data.nextPageToken;
                this.updateRestaurantList(items, nextToken)
            }).onError(error => {
            this.showError(error.message)
        }).execute()
    }

    refresh() {
        new RemoteCall("/api/restaurant/list?nextPageToken=" + this.getCurrentPageToken())
            .useJson()
            .useGET()
            .onJsonResponse(json => {
                const items = json.data.restaurants || [];
                this.updateRestaurantList(items)
            }).onError(error => {
            this.showError(error.message)
        }).execute()
    }

    refreshFromBeginning() {
        this.state.pageTokens = [];
        this.refresh();
    }
    updateRestaurantList(items, nextPageToken) {
        if (!!nextPageToken) {
            this.state.pageTokens.push(nextPageToken)
        }
        this.setState({
            items : items,
            error : null,
        })
    }

    showError(errorMsg) {
        this.setState({
            error : errorMsg
        })
    }

    edit(id) {
        return (e) => {
            this.setState({
                action : this.action.EDIT,
                editing_id: id
            })
        }

    }

    delete(id) {
        return () => {
            new RemoteCall("/api/restaurant/" + id)
                .useJson()
                .useDELETE()
                .onJsonResponse(json => {
                    if (0 === json.status_code) {
                        this.refresh()
                    } else {
                        this.showError(json.message)
                    }
                }).onError(error => {
                    this.showError(error.message)
            }).execute()
        }
    }

    add(e) {
        this.setState({
            action : this.action.ADD,
            editing_id : null
        })
    }

    addBranch(id) {
        return (e) => {
            this.setState({
                action : this.action.CLONE,
                editing_id : id,

            })
        }
    }

    openPhotoView(id) {
        return (e) => {
            this.setState({
                editing_id : id,
                action : this.action.PHOTO
            })
        }
    }

    uploadPhoto(data) {
            let r = this.state.items.find(item => item.id === this.state.editing_id);
            if (r) {
                if (Array.isArray(r.photos)) r.photos.push(data.mediaLink);
                else r.photos = [data.mediaLink];
                new RemoteCall("/api/restaurant/" + r.id)
                    .usePUT()
                    .useJson()
                    .setBody({photos : r.photos})
                    .onJsonResponse(json => {
                        if (0 === json.status_code) {
                            this.setState(this.state)
                        } else {
                            this.setState({error : json.message})
                        }
                    }).onError(error => {
                        this.setState({error : error.message})
                }).execute()
            } else {
                this.setState({error : "Can not found restaurant " + this.state.editing_id})
            }

    }

    showFoods(id) {
        return (e) => {
            let r = this.findItem(id);
            this.setState({
                action : this.action.SHOW_FOOD,
                editing_id : id,
                restaurant : r
            })
        }
    }

    modalClose() {
        this.setState({
            action : this.action.NONE,
            editing_id : null
        })
    }

    onSubmitted(json) {
        this.setState({
           action : this.action.NONE,
            editing_id : null
        });
        this.refresh();

    }

    findItem(id) {
        for (let item of this.state.items) {
            if (item.id === id) {
                return new Restaurant(item, id)
            }
        }
        return null;
    }

}

export default RestaurantList;