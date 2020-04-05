import React from "react"
import RemoteCall from "./utils/RemoteCall";
import {Box} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import AppController from "./AppController";
import AppSections from "./AppSections";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

class ContributorList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            items : []
        }
        this.goToAdd = this.goToAdd.bind(this);
    }

    componentWillMount() {
        new RemoteCall("/api/contributors")
            .useJson()
            .useGET()
            .onJsonResponse(json => {
                if (json.status_code === 0) {
                    this.setState({
                        error : null,
                        items : json.data.users
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
        }).execute();
    }

    render() {
        let rows = this.state.items.map(item => {
            return this.renderRow(item)
        });
        return (
            <div>
                <Typography variant={"h6"}>Contributors</Typography>
                <Paper>
                    <Box p={1}>
                        <Button color={"primary"} onClick={this.goToAdd}>ADD</Button>
                    </Box>

                    <Table>
                        <TableBody>
                            {rows}
                        </TableBody>
                    </Table>
                </Paper>


            </div>
        );
    }

    renderRow(item) {
        return (
            <TableRow>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.first_name} {item.last_name}</TableCell>
                <TableCell>
                    <Button color="secondary" onClick={this.goToEdit(item)}>EDIT</Button>
                    <Button color="secondary" onClick={this.goToContributions(item)}>CONTRIBUTIONS</Button>
                </TableCell>
            </TableRow>
        )
    }

    goToAdd() {
        AppController.setSection(AppSections.ADD_CONTRIBUTOR);
    }

    goToEdit(data) {
        return (e) => {
            AppController.setSection(AppSections.EDIT_CONTRIBUTOR, data);
        }
    }

    goToContributions(item) {
        return (e) => {
            AppController.setSection(AppSections.CONTRIBUTIONS, item)
        }
    }

}

export default ContributorList;