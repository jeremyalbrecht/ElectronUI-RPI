"use strict";

var AlarmLink = React.createClass({
  displayName: "AlarmLink",

  getInitialState: function getInitialState() {
    return { Rstate: "", etat: "", color: "", action: ""};
  },
  loadState: function loadState() {
    $.post({
      url: "http://" + this.props.ip + "/api/v1/alarms/" + this.props.id,
      headers: {
        "Token-Id": this.props.tokenID,
        "Token-Key": this.props.tokenKey
      },
      success: function (data) {
        if (data['state'] == "0") {
          this.setState({ etat: false, color:"green lighten-2", action: "Activer"});
        } else if (data['state'] == '1') {
          this.setState({ etat: true, color:"red lighten-2", action: "Désactiver"});
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({ etat: false, color:"red darken-3", colorSave: "red darken-3", actual: "Erreur API", action: err.toString(), link: "Erreur API"});
      }.bind(this)
    });
  },
  handleClick: function handleClick() {
   $.post({
     url: "http://" + ip + "/api/v1/alarm/up/" + this.props.id,
     headers: {
       "Token-Id": this.props.tokenID,
       "Token-Key": this.props.tokenKey
     },
     success: function (data) {
        this.setState({action: "OK"});
     }.bind(this),
     error: function (xhr, status, err) {
       console.error(this.props.url, status, err.toString());
       this.setState({action: "Erreur API", color: "red darken-3"});
     }.bind(this)
   });
 },
  componentDidMount: function componentDidMount() {
    this.loadState();
    setInterval(this.loadState, 1500);
  },
  render: function render() {
    return React.createElement(
        "a",
        { "className" : "waves-effect waves-light btn "+ this.state.color, onClick: this.handleClick},
        this.state.action
      );
  }
});
