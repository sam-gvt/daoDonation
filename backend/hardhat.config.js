require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */

const RPC_URL = process.env.RPC_URL;
const PK_addr1 = process.env.PK_addr1;
// const PK_addr2 = process.env.PK_addr2;
// const PK_addr3 = process.env.PK_addr3;

//, `0x${PK_addr2}`, `0x${PK_addr3}`

module.exports = {
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: `${RPC_URL}`,
      accounts: [`0x${PK_addr1}`],
    },
    // localhost: {
    //   url: "http://127.0.0.1:8545"
    // },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.18"
      }
    ]
  },
};
