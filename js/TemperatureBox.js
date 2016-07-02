"use strict";

var TemperatureBox = React.createClass({
  displayName: "TemperatureBox",

  getInitialState: function getInitialState() {
    return { temp: "" };
  },
  loadTemp: function loadTemp() {
    $.post({
      url: "/api/v1/temperature",
      data: { id: this.props.id },
      headers: {
        'Token-Id': this.props.tokenID,
        'Token-Key': this.props.tokenKey
      },
      success: function (data) {
        this.setState({ temp: data['value'] });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function componentDidMount() {
    this.loadTemp();
    setInterval(this.loadTemp, 300000);
  },
  render: function render() {
    return React.createElement("a", { className : "waves-effect waves-light btn green lighten-2"}, React.createElement("i", { className: "fa fa-leaf left" }), " ", this.props.name +" " + this.state.temp);
  }
});
