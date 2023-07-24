const { ethers } = require("hardhat")

async function main() {

    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    let admins = [owner, addr1];


    const _hardhatContract = await hre.ethers.getContractAt("Donation", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
 
    for(i = 0; i < admins.length; i ++) {
        let vote = await _hardhatContract.connect(admins[i]).vote(addr2, true);
        vote.wait();
        let vote2 = await _hardhatContract.connect(admins[i]).vote(addr3, true);
        vote2.wait();
        let vote3 = await _hardhatContract.connect(admins[i]).vote(addr4, true);
        vote3.wait();
    }


    }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });