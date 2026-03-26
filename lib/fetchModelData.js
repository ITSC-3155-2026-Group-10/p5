/**
 * FetchModel - Fetch a model from the web server.
 * url - string - The URL to issue the GET request.
 */

function fetchModel(url) {
  return new Promise(function (resolve, reject) {
    function xhrHandler() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status !== 200) {
        const error = {status: this.status, statusText: this.statusText};
        reject(new Error(error.toString()));
      }
      resolve({data: JSON.parse(this.responseText)});
    }
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = xhrHandler;
    xhr.open("GET", url);
    xhr.send();
  });
}
export default fetchModel;
