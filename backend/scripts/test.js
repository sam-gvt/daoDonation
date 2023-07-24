const { ethers } = require("hardhat")

async function main() {

    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const _hardhatContract = await hre.ethers.getContractAt("Donation", "0x5FbDB2315678afecb367f032d93F642f64180aa3")

    console.log(await _hardhatContract.getAllAssociationsOnStandBy());


    }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });