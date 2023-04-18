import route from "./route";
import { useCookies } from "react-cookie";

const getPendingOrderApi = async (token) => {
  let header = {
    Authorization: `Bearer ${token}`,
  };

  let requestOptions = {
    method: "GET",
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  };

  const res = await fetch(`${route}cabinets`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  return res;
};

export default getPendingOrderApi;
