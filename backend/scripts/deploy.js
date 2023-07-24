async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  console.log("Deploying contracts with the admins :", owner.address, addr1.address);
  let admins = [owner, addr1];
  const donation = await ethers.deployContract("Donation", [admins]);

  
  console.log("Donation address:", await donation.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });