const { ethers } = require("hardhat")

async function main() {

    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const _hardhatContract = await hre.ethers.getContractAt("Donation", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
    // register
    await _hardhatContract.registerNewAssociation(
        addr2.address,
        'name',
        'activity',
        'goal',
        'localisation',
        'officialWebsite'
    );
    await _hardhatContract.registerNewAssociation(
        addr3.address,
        'name',
        'activity',
        'goal',
        'localisation',
        'officialWebsite'
    );
    await _hardhatContract.registerNewAssociation(
        addr4.address,
        'name',
        'activity',
        'goal',
        'localisation',
        'officialWebsite'
    );

    await _hardhatContract.connect(owner).createSession(addr2, 'association')
    await _hardhatContract.connect(owner).createSession(addr3, 'association')
    await _hardhatContract.connect(owner).createSession(addr4, 'association')


    }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });