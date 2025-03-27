(function (xhr) {
  var XHR = XMLHttpRequest.prototype;

  var open = XHR.open;
  var send = XHR.send;
  var setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = new Date().toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function () {
    this.addEventListener("load", function () {
      if (
        this._url.includes("graphql") &&
        this.response.slice(0, 10).includes("data")
      ) {
        console.log(this);
        console.log(JSON.parse(this.responseText));
      }
    });

    return send.apply(this, arguments);
  };
})(XMLHttpRequest);
