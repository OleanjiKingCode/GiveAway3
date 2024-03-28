const hre = require("hardhat");

async function main() {
  const GiveAwayContract = await hre.ethers.deployContract("GiveAwayContract", [
    "0xe1cE95479C84e9809269227C7F8524aE051Ae77a",
    "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
  ]);

  await GiveAwayContract.waitForDeployment();

  console.log(
    `GiveAwayContract contract deployed to ${await GiveAwayContract.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Mumbai
// Gateway Contract:
// 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B
// Gas Service Contract:
// 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Fanthom
// Gateway Contract:
// 0x97837985Ec0494E7b9C71f5D3f9250188477ae14
// Gas Service Contract:
// 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Arbitrum sepolia
// Gateway Contract:
// 0xe1cE95479C84e9809269227C7F8524aE051Ae77a
// Gas Service Contract:
// 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
