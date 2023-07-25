async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();
  //const [deployer] = await ethers.getSigners();
  //console.log("Deploying contracts with the admins :", owner.address, addr1.address);
  //console.log("Deploying contracts with the account:", deployer.address);

  let admins = [owner, addr1, addr2];
  //let admins = [deployer];
  //console.log(admins);
  const donation = await ethers.deployContract("Donation", [admins]);

  
  console.log("Donation address:", await donation.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });