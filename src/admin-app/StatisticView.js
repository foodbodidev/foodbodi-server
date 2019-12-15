import React from "react"
import firebase from "firebase"
import firestore from "firebase/firestore"

class StatisticView extends React.Component{
    constructor(props) {
        super(props);


    }

    componentDidMount() {
        let db = firebase.firestore();
        db.collection("")
    }

    render() {
        return (
            <div>

            </div>
        );
    }

}

export default StatisticView;