const { ethers } = require("hardhat")

async function main() {

    [addr1, addr2] = await ethers.getSigners();

    console.log("addr1 :", addr1);
    console.log("addr2 :", addr2);

    const _hardhatContract = await hre.ethers.getContractAt("Donation", "0x5B6CA4CfEfD31FC3903B23A7e62BbF1A45267313")
    // register
    await _hardhatContract.registerNewAssociation(
        addr1.address,
        'chien',
        'animal',
        'sauver les chiens',
        'paris',
        'https://chien.fr'
    );

    await _hardhatContract.registerNewAssociation(
        addr2.address,
        'Foret',
        'Environnemental',
        'planter des arbres',
        'Amazonie',
        'https://foret.com'
    );

    await _hardhatContract.connect(addr1).createSession(addr1, 'association')
    await _hardhatContract.connect(addr2).createSession(addr2, 'association')


    }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });