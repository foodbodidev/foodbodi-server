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


class RestaurantList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            items : [],
            error : null,
            pageTokens : [],
            isEditing : false,
            editing_id : null
        };

       // this.delete = this.delete.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.backPage = this.backPage.bind(this);
        this.add = this.add.bind(this);
        this.modalClose = this.modalClose.bind(this);

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

    render() {
        return (
            <div>

                {this.state.error !== null ? this.renderError() : ""}
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.isEditing}
                    onClose={this.modalClose}
                >
                    <div>
                       <EditRestaurantView restaurant_id={this.state.editing_id} onSubmitted={this.onSubmitted} onCancelled={this.modalClose}></EditRestaurantView>
                    </div>
                </Modal>
                <div>
                    <Button onClick={this.add}>Add</Button>
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
                </TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.open_hour} ~ {item.close_hour}</TableCell>
                <TableCell>
                    <Button onClick={this.edit(item.id)} data={item.id}>
                        Edit
                    </Button>
                    <Button onClick={this.edit(item.id)} data={item.id}>
                        Add Branch
                    </Button>
                    <Button onClick={this.delete(item.id)} data={item.id}> Delete </Button>
                </TableCell>
            </TableRow>


        ));

        return (
            <Paper>
                <div>
                    <Typography variant="h6"> Restaurants </Typography>
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
                isEditing: true,
                editing_id: id
            })
        }

    }

    delete(id) {
        return () => {

        }
    }

    add(e) {
        this.setState({
            isEditing : true,
            editing_id : null
        })
    }

    modalClose() {
        this.setState({
            isEditing : false,
            editing_id : null
        })
    }

    onSubmitted(json) {
        this.setState({
            isEditing : false,
            editing_id : null
        });

    }

}

export default RestaurantList;