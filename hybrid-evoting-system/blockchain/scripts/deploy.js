const hre = require("hardhat");

async function main() {
    console.log("Deploying contracts to", hre.network.name);

    // Deploy VoteStorage
    console.log("\nDeploying VoteStorage...");
    const VoteStorage = await hre.ethers.getContractFactory("VoteStorage");
    const voteStorage = await VoteStorage.deploy();
    await voteStorage.waitForDeployment();
    const voteStorageAddress = await voteStorage.getAddress();
    console.log("✅ VoteStorage deployed to:", voteStorageAddress);

    // Deploy MultiSigAdmin
    console.log("\nDeploying MultiSigAdmin...");
    const [deployer] = await hre.ethers.getSigners();

    // Use only deployer address (single admin for development)
    const admins = [deployer.address];
    const requiredApprovals = 1; // Only 1 approval needed

    const MultiSigAdmin = await hre.ethers.getContractFactory("MultiSigAdmin");
    const multiSigAdmin = await MultiSigAdmin.deploy(admins, requiredApprovals);
    await multiSigAdmin.waitForDeployment();
    const multiSigAdminAddress = await multiSigAdmin.getAddress();
    console.log("✅ MultiSigAdmin deployed to:", multiSigAdminAddress);

    console.log("\n📋 Deployment Summary:");
    console.log("========================");
    console.log("VoteStorage:", voteStorageAddress);
    console.log("MultiSigAdmin:", multiSigAdminAddress);
    console.log("Network:", hre.network.name);
    console.log("Deployer:", deployer.address);

    console.log("\n💾 Save these addresses to your .env file:");
    console.log(`VOTE_STORAGE_ADDRESS=${voteStorageAddress}`);
    console.log(`MULTISIG_ADMIN_ADDRESS=${multiSigAdminAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
