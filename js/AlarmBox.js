"use strict";

var AlarmBox = React.createClass({
  displayName: "AlarmBox",

  getInitialState: function getInitialState() {
    return { etat: "", color:"", actual: "", action: "", link: ""};
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
          this.setState({ etat: false, color:"green lighten-2", colorSave: "green lighten-2", actual: "Désactivée", action: "Activer", link: "Désactivée"});
        } else if (data['state'] == '1') {
          this.setState({ etat: true, color:"red lighten-2", colorSave: "red lighten-2", actual: "Activée", action: "Désactiver", link: "Activée"});
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({ etat: false, color:"red darken-3", colorSave: "red darken-3", actual: "Erreur API", action: err.toString(), link: "Erreur API"});
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
        this.state.link
      );
  }
});
