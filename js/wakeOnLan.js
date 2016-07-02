"use strict";

var wakeOnLan = React.createClass({
  displayName: "wakeOnLan",

  getInitialState: function getInitialState() {
    return { color: "blue", text: "Power On" };
  },
  powerOn: function powerOn(e) {
    $.ajax({
      url: "http://" + this.props.ip + "/api/v1/wakeOnLan",
      method: "POST",
      data: { id: this.props.id },
      headers: {
       'Token-Id':this.props.tokenID,
       'Token-Key':this.props.tokenKey,
      },
      success: function (data) {
        console.log(data);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        Materialize.toast(err.toString(), 4000);
      }.bind(this)
    });
  },
  render: function render() {
    return React.createElement("a", { "className": "waves-effect waves-orange btn " + this.state.color, onClick: this.powerOn }, React.createElement("i", { "className": "fa fa-power-off left" }), this.props.name);
  }
});
