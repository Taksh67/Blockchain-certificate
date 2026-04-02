const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateNFT Contract", function () {
  let certificateNFT;
  let owner;
  let admin;
  let student1;
  let student2;

  beforeEach(async function () {
    // Get signers
    [owner, admin, student1, student2] = await ethers.getSigners();

    // Deploy contract
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    certificateNFT = await CertificateNFT.deploy(admin.address);
    await certificateNFT.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct admin", async function () {
      expect(await certificateNFT.getAdmin()).to.equal(admin.address);
    });

    it("Should start with zero certificates", async function () {
      expect(await certificateNFT.totalSupply()).to.equal(0);
    });
  });

  describe("Issue Certificate", function () {
    it("Should issue a certificate from admin", async function () {
      const tx = await certificateNFT.connect(admin).issueCertificate(
        student1.address,
        "John Doe",
        "Blockchain 101",
        "A+",
        "Harvard University"
      );

      const receipt = await tx.wait();

      expect(receipt.events[0].event).to.equal("Transfer");
      expect(receipt.events[1].event).to.equal("CertificateIssued");
      expect(await certificateNFT.totalSupply()).to.equal(1);
      expect(await certificateNFT.getOwnerOfToken(1)).to.equal(student1.address);
      expect(await certificateNFT.getBalance(student1.address)).to.equal(1);
    });

    it("Should reject issuance from non-admin", async function () {
      await expect(
        certificateNFT.connect(student1).issueCertificate(
          student2.address,
          "Jane Doe",
          "Blockchain 101",
          "A",
          "MIT"
        )
      ).to.be.revertedWith("Only admin can issue certificates");
    });

    it("Should reject invalid recipient address", async function () {
      await expect(
        certificateNFT.connect(admin).issueCertificate(
          ethers.constants.AddressZero,
          "John Doe",
          "Course",
          "A+",
          "University"
        )
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should reject empty student name", async function () {
      await expect(
        certificateNFT.connect(admin).issueCertificate(
          student1.address,
          "",
          "Blockchain 101",
          "A+",
          "University"
        )
      ).to.be.revertedWith("Student name cannot be empty");
    });

    it("Should reject empty course name", async function () {
      await expect(
        certificateNFT.connect(admin).issueCertificate(
          student1.address,
          "John Doe",
          "",
          "A+",
          "University"
        )
      ).to.be.revertedWith("Course name cannot be empty");
    });

    it("Should reject empty grade", async function () {
      await expect(
        certificateNFT.connect(admin).issueCertificate(
          student1.address,
          "John Doe",
          "Blockchain 101",
          "",
          "University"
        )
      ).to.be.revertedWith("Grade cannot be empty");
    });

    it("Should reject empty institution", async function () {
      await expect(
        certificateNFT.connect(admin).issueCertificate(
          student1.address,
          "John Doe",
          "Blockchain 101",
          "A+",
          ""
        )
      ).to.be.revertedWith("Institution cannot be empty");
    });
  });

  describe("Verify Certificate", function () {
    beforeEach(async function () {
      await certificateNFT.connect(admin).issueCertificate(
        student1.address,
        "John Doe",
        "Blockchain 101",
        "A+",
        "Harvard University"
      );
    });

    it("Should return correct certificate data", async function () {
      const [studentName, courseName, grade, institution, issuedAt, isValid] =
        await certificateNFT.verifyCertificate(1);

      expect(studentName).to.equal("John Doe");
      expect(courseName).to.equal("Blockchain 101");
      expect(grade).to.equal("A+");
      expect(institution).to.equal("Harvard University");
      expect(isValid).to.equal(true);
      expect(issuedAt).to.be.gt(0);
    });

    it("Should return certificate as struct", async function () {
      const cert = await certificateNFT.getCertificateDetails(1);

      expect(cert.studentName).to.equal("John Doe");
      expect(cert.courseName).to.equal("Blockchain 101");
      expect(cert.grade).to.equal("A+");
      expect(cert.institution).to.equal("Harvard University");
      expect(cert.isValid).to.equal(true);
    });

    it("Should reject non-existent certificate", async function () {
      await expect(certificateNFT.verifyCertificate(999)).to.be.revertedWith(
        "Certificate does not exist"
      );
    });

    it("Should check validity correctly", async function () {
      expect(await certificateNFT.isCertificateValid(1)).to.equal(true);

      await certificateNFT.connect(admin).revokeCertificate(1);
      expect(await certificateNFT.isCertificateValid(1)).to.equal(false);
    });
  });

  describe("Revoke Certificate", function () {
    beforeEach(async function () {
      await certificateNFT.connect(admin).issueCertificate(
        student1.address,
        "John Doe",
        "Blockchain 101",
        "A+",
        "Harvard University"
      );
    });

    it("Should revoke certificate from admin", async function () {
      const tx = await certificateNFT.connect(admin).revokeCertificate(1);
      const receipt = await tx.wait();

      expect(receipt.events[0].event).to.equal("CertificateRevoked");

      const [, , , , , isValid] = await certificateNFT.verifyCertificate(1);
      expect(isValid).to.equal(false);
    });

    it("Should reject revocation from non-admin", async function () {
      await expect(
        certificateNFT.connect(student1).revokeCertificate(1)
      ).to.be.revertedWith("Only admin can issue certificates");
    });

    it("Should reject revoking non-existent certificate", async function () {
      await expect(
        certificateNFT.connect(admin).revokeCertificate(999)
      ).to.be.revertedWith("Certificate does not exist");
    });

    it("Should reject revoking already revoked certificate", async function () {
      await certificateNFT.connect(admin).revokeCertificate(1);

      await expect(
        certificateNFT.connect(admin).revokeCertificate(1)
      ).to.be.revertedWith("Certificate already revoked");
    });
  });

  describe("Admin Management", function () {
    it("Should change admin", async function () {
      await certificateNFT.connect(admin).setAdmin(student1.address);
      expect(await certificateNFT.getAdmin()).to.equal(student1.address);
    });

    it("Should reject admin change from non-admin", async function () {
      await expect(
        certificateNFT.connect(student1).setAdmin(student2.address)
      ).to.be.revertedWith("Only admin can issue certificates");
    });

    it("Should reject invalid admin address", async function () {
      await expect(
        certificateNFT.connect(admin).setAdmin(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid admin address");
    });
  });

  describe("Balance Tracking", function () {
    it("Should track balance correctly", async function () {
      expect(await certificateNFT.getBalance(student1.address)).to.equal(0);

      await certificateNFT.connect(admin).issueCertificate(
        student1.address,
        "John Doe",
        "Course 1",
        "A+",
        "University 1"
      );

      expect(await certificateNFT.getBalance(student1.address)).to.equal(1);

      await certificateNFT.connect(admin).issueCertificate(
        student1.address,
        "Jane Doe",
        "Course 2",
        "A",
        "University 2"
      );

      expect(await certificateNFT.getBalance(student1.address)).to.equal(2);
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      await certificateNFT.connect(admin).issueCertificate(
        student1.address,
        "John Doe",
        "Course 1",
        "A+",
        "University 1"
      );
      await certificateNFT.connect(admin).issueCertificate(
        student1.address,
        "Jane Doe",
        "Course 2",
        "A",
        "University 2"
      );
      await certificateNFT.connect(admin).issueCertificate(
        student2.address,
        "Bob Smith",
        "Course 3",
        "B+",
        "University 3"
      );
    });

    it("Should get certificates by owner", async function () {
      const tokens = await certificateNFT.getCertificatesByOwner(student1.address);
      expect(tokens.length).to.equal(2);
      expect(tokens[0]).to.equal(1);
      expect(tokens[1]).to.equal(2);
    });

    it("Should return empty array for address with no certificates", async function () {
      const tokens = await certificateNFT.getCertificatesByOwner(owner.address);
      expect(tokens.length).to.equal(0);
    });

    it("Should return correct certificate details", async function () {
      const token = await certificateNFT.getOwnerOfToken(1);
      expect(token).to.equal(student1.address);
    });
  });
});
