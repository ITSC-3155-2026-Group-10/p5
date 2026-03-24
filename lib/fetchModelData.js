/**
 * FetchModel - Fetch a model from the web server.
 * url - string - The URL to issue the GET request.
 */

function fetchModel(url) {
  return new Promise(function (resolve, reject) {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {

      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {

        resolve({
          data: JSON.parse(xhr.responseText)
        });

      } else {

        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });

      }

    };

    xhr.open("GET", url);

    xhr.send();

  });
}

export default fetchModel;
