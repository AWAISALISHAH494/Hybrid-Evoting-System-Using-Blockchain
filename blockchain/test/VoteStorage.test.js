const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VoteStorage", function () {
    let voteStorage;
    let owner, admin1, admin2;

    beforeEach(async function () {
        [owner, admin1, admin2] = await ethers.getSigners();

        const VoteStorage = await ethers.getContractFactory("VoteStorage");
        voteStorage = await VoteStorage.deploy();
        await voteStorage.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await voteStorage.owner()).to.equal(owner.address);
        });

        it("Should set owner as admin", async function () {
            expect(await voteStorage.admins(owner.address)).to.be.true;
        });
    });

    describe("Admin Management", function () {
        it("Should allow owner to add admin", async function () {
            await voteStorage.addAdmin(admin1.address);
            expect(await voteStorage.admins(admin1.address)).to.be.true;
        });

        it("Should allow owner to remove admin", async function () {
            await voteStorage.addAdmin(admin1.address);
            await voteStorage.removeAdmin(admin1.address);
            expect(await voteStorage.admins(admin1.address)).to.be.false;
        });

        it("Should not allow non-owner to add admin", async function () {
            await expect(
                voteStorage.connect(admin1).addAdmin(admin2.address)
            ).to.be.revertedWith("Only owner can call this");
        });
    });

    describe("Result Storage", function () {
        const electionId = "ELECTION-001";
        const resultHash = ethers.keccak256(ethers.toUtf8Bytes("test-result"));
        const totalVotes = 1000;

        it("Should store election result", async function () {
            await voteStorage.storeResult(electionId, resultHash, totalVotes);

            const result = await voteStorage.getResult(electionId);
            expect(result.resultHash).to.equal(resultHash);
            expect(result.totalVotes).to.equal(totalVotes);
            expect(result.finalized).to.be.true;
        });

        it("Should emit ResultStored event", async function () {
            await expect(voteStorage.storeResult(electionId, resultHash, totalVotes))
                .to.emit(voteStorage, "ResultStored")
                .withArgs(electionId, resultHash, totalVotes, await ethers.provider.getBlockNumber() + 1, owner.address);
        });

        it("Should not allow storing result twice", async function () {
            await voteStorage.storeResult(electionId, resultHash, totalVotes);

            await expect(
                voteStorage.storeResult(electionId, resultHash, totalVotes)
            ).to.be.revertedWith("Result already finalized");
        });

        it("Should verify correct result hash", async function () {
            await voteStorage.storeResult(electionId, resultHash, totalVotes);

            const isValid = await voteStorage.verifyResult(electionId, resultHash);
            expect(isValid).to.be.true;
        });

        it("Should reject incorrect result hash", async function () {
            await voteStorage.storeResult(electionId, resultHash, totalVotes);

            const wrongHash = ethers.keccak256(ethers.toUtf8Bytes("wrong-result"));
            const isValid = await voteStorage.verifyResult(electionId, wrongHash);
            expect(isValid).to.be.false;
        });
    });

    describe("Election Count", function () {
        it("Should track election count", async function () {
            const hash1 = ethers.keccak256(ethers.toUtf8Bytes("result1"));
            const hash2 = ethers.keccak256(ethers.toUtf8Bytes("result2"));

            await voteStorage.storeResult("ELECTION-001", hash1, 100);
            await voteStorage.storeResult("ELECTION-002", hash2, 200);

            const count = await voteStorage.getElectionCount();
            expect(count).to.equal(2);
        });

        it("Should get election ID by index", async function () {
            const hash = ethers.keccak256(ethers.toUtf8Bytes("result"));
            await voteStorage.storeResult("ELECTION-001", hash, 100);

            const electionId = await voteStorage.getElectionIdByIndex(0);
            expect(electionId).to.equal("ELECTION-001");
        });
    });
});
