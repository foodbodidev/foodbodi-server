import React from "react"
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Image from "material-ui-image";
import {useDropzone} from 'react-dropzone'
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import GridListTile from "@material-ui/core/GridListTile";


class ImageGallery extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selected_image : this.props.selected_image,
            selected_files : null,
            uploadMessage : ""
        };

        this.selectImage = this.selectImage.bind(this);
        this.add = this.add.bind(this);
        this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
        this.upload = this.upload.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    renderRow() {
        let rows = this.props.image_urls || [];
        return rows.map(item => {
            return (
                <Box key={item} p={1} m={1} border={1} style={{width: "150px", height : "100px"}}>
                    <img src={item} onClick={this.selectImage(item)} style={{width: "150px", height : "100px"}}/>
                </Box>
            )
        })
    }

    render() {
        return (
            <Container>
                <Paper style={{height: "800px", overflowY : "scroll"}}>
                    <Button onClick={this.cancel} style={{float : "right"}}>Close</Button>
                    {this.renderUploader()}
                    <Box p={2} borderBottom={1} >
                        <Typography variant="h5">Preview</Typography>
                        <div style={{backgroundColor : "black", padding : "5px"}}>
                            <div style={{marginRight : "auto", marginLeft : "auto", width : "fit-content"}}>
                                <img src={this.state.selected_image || "https://via.placeholder.com/300x200?text=Foodbodi"} style={{width : "600px", height : "400px"}}/>
                            </div>
                        </div>
                    </Box>
                    <Box m={2} borderBottom={1}>
                        <div style={{display : "flex", overflowX : "scroll"}}>
                            {this.renderRow()}
                        </div>
                    </Box>
                </Paper>
            </Container>
        );
    }

    renderUploader() {
        return (
            <Box p={2} borderBottom={1}>
                <Typography variant="h5">Upload new photo</Typography>
                <input type="file" name="file" onChange={this.onFileChangeHandler} accept="image/*"/>
                <Button onClick={this.upload} disabled={this.state.selected_files == null}>Upload</Button>
                <Typography variant="caption">{this.state.uploadMessage}</Typography>
            </Box>
        )
    }

    onFileChangeHandler(e) {
        console.log("Files: " + e.target.files);
        this.setState({uploadMessage : ""});
        let error = null;
        for (let file of e.target.files) {
            if (!file.type.startsWith('image/')) {
                error += file.name + " is not an image\n";
            }
        }
        if (error) {
            this.setState({
                uploadMessage : error
            })
        } else {
            this.setState({
                selected_files: Array.from(e.target.files)
            })
        }
    }

    upload() {
        if (Array.isArray(this.state.selected_files)) {
            for (let file of this.state.selected_files) {
                this.uploadFile(file)
            }
        }
    }

    selectImage(item) {
        return (e) => {
            this.setState({
                selected_image: item
            })
        }
    }

    add(e) {

    }

    uploadFile(file) {
        var formData = new FormData();
        formData.append("file", file);
        var xml = new XMLHttpRequest();
        xml.open("POST", "/api/upload/photo?filename=" + file.name, true);
        xml.upload.addEventListener("progress", (data) => {
            console.log("Progress : " + data.lengthComputable);
            this.setState({uploadMessage : data.lengthComputable})
        });
        xml.upload.addEventListener("load", (data) => {
            this.setState({uploadMessage : "Complete"})
        });
        xml.upload.addEventListener("error", (data) => {
            this.setState({uploadMessage : data.message})
        });
        xml.upload.addEventListener("abort", (data) => {
            console.log("Abort : " + JSON.stringify(data))
        });
        xml.onreadystatechange = () => {
            if (xml.readyState === XMLHttpRequest.DONE) {
                const responseText = xml.responseText;
                const json = JSON.parse(responseText);
                if (0 === json.status_code) {
                    const link = json.data.mediaLink;
                    console.log(link);
                    this.setState({selected_files : null, uploadMessage : json.message});
                    if (this.props.onUploaded) {
                        this.props.onUploaded(json.data)
                    }
                } else {
                    this.setState({uploadMessage : json.message});
                }
            }
        };
        xml.send(formData);
    }

    cancel(e) {
        if (this.props.onCancelled) {
            this.props.onCancelled()
        }
    }

}

export default ImageGallery