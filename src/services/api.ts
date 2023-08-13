import { useGlobalContext } from "../context";

//@ts-ignore
const Web3 = window.Web3;
const web3 = new Web3(Web3.givenProvider);

function formatHostUrl(hostapi: string) {
  if (hostapi[hostapi.length - 1] === "/") {
    return hostapi.slice(0, -1);
  }
  return hostapi;
}

async function post(url: string, data: any): Promise<any> {
  let rs = await fetch(
    `${formatHostUrl(`${process.env.REACT_APP_API_HOST}`)}${url}`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }
  );
  let refresh_token = rs.headers.get("refresh-token");
  if (refresh_token) {
    sessionStorage.setItem("token", refresh_token);
    console.log({ refresh_token });
  }
  switch (rs.status) {
    case 200:
      let tmp = await rs.json();
      return tmp;
    case 403:
    case 405:
      sessionStorage.clear();
      localStorage.clear();
      throw new Error("forbidden");
    case 423:
      try {
        let tmp = await rs.json();
        throw new Error(tmp.code);
      } catch (error) {
        throw error;
      }
    default:
      let err = await rs.json();
      throw err;
  }
}

// authenticate handle
async function getNonce() {
  let rs = await api.post("/nonce/create-nonce", {});
  return rs.nonce;
}

async function checkNetwork() {
  // @ts-ignore
  const currentNetwork = await window.ethereum.request({
    method: "eth_chainId",
  });
  if ("0x61" !== currentNetwork) {
    await changeNetwork();
    // @ts-ignore
    const changedNetwork = await window.ethereum.request({
      method: "eth_chainId",
    });
    if ("0x61" !== changedNetwork) {
      throw new Error("failed to switch network");
    }
  }
}

async function changeNetwork() {
  try {
    // @ts-ignore
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });
  } catch (switchError: any) {
    console.log({ switchError });
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      console.log("Add net work");
      // @ts-ignore
      await window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x61",
              chainName: "BSC testnet",
              nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
              rpcUrls: [
                "https://data-seed-prebsc-2-s1.binance.org:8545/",
                "https://data-seed-prebsc-2-s3.binance.org:8545/",
                "https://data-seed-prebsc-1-s2.binance.org:8545/",
              ],
              blockExplorerUrls: ["https://testnet.bscscan.com/"],
            },
          ],
        })
        .catch((error: any) => {
          console.log(error);
          throw error;
        });
    }
  }
}

async function login() {
  sessionStorage.clear();
  let nonce = await getNonce();
  await checkNetwork();
  //@ts-ignore
  const account = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  let sign = await web3.eth.personal.sign(nonce, account[0], "publicpassword");
  let { customerInfo, token, authInfos } = await api.post(
    "/customer/login-customer",
    {
      sign,
      nonce,
      type: 0,
    }
  );
  sessionStorage.setItem("token", token);
  return { customerInfo, authInfos };
}

async function register() {
  await checkNetwork();
  let nonce = await getNonce();
  //@ts-ignore
  await window.ethereum._metamask.isUnlocked();
  //@ts-ignore
  const account = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  let sign = await web3.eth.personal.sign(nonce, account[0], "publicpassword");
  let { customerInfo, token, authInfos } = await api.post(
    "/customer/register",
    {
      sign,
      nonce,
      type: 0,
    }
  );
  sessionStorage.setItem("token", token);
  return { customerInfo, authInfos };
}

const api = {
  post,
  login,
  register,
};

export default api;
