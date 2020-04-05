let AppController = {};

AppController.setInstance = (instance) => {
    AppController.instance = instance;
};

AppController.getInstance = () => {
    return AppController.instance;
};

AppController.setSection = (sectionName, sectionData) => {
    let instance = AppController.getInstance();
    instance.state.section = sectionName;
    instance.state.section_data = sectionData;
    instance.setState({});
};

module.exports = AppController;