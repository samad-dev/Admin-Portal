import route from "./route";

const loginApi = async (username, password) => {
  var urlencoded = new URLSearchParams();
  urlencoded.append("username", username);
  urlencoded.append("password", password);

  // PHP raw body
  // const body = {
  //   username,
  //   password,
  // }

  // var requestOptions = {
  //   method: "POST",
  //   body: body,
  //   redirect: "follow",
  // };

  var requestOptions = {
    method: "POST",
    body: urlencoded,
  };

  const res = await fetch(`${route}/login`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  return res;
};

export default loginApi;
