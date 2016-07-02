"use strict";

var AlarmBox = React.createClass({
  displayName: "AlarmBox",

  getInitialState: function getInitialState() {
    return { etat: "", color:"", name:""};
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
          this.setState({ etat: false, color:"green", colorSave: "green"});
        } else if (data['state'] == '1') {
          this.setState({ etat: true, color:"red", colorSave: "red"});
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({ etat: false, color:"red darken-3", colorSave: "red darken-3"});
      }.bind(this)
    });
  },
  componentDidMount: function componentDidMount() {
    this.loadState();
    setInterval(this.loadState, 10000);
  },
  render: function render() {
    return React.createElement(
        "a",
        { "className" : "waves-effect waves-light btn "+ this.state.color, onClick: this.handleClick},
        this.props.name
      );
  }
});
