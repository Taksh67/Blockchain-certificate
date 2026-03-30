// SPDX-License-Identifier: MIT
// NFT-Based Blockchain Certificate Verification System
// Author: Taksh Padmani

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::{string::String, vec::Vec};
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    alloy_sol_types::sol,
    evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageBool, StorageMap, StorageString, StorageU256},
};

sol! {
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string  studentName,
        string  courseName,
        string  grade,
        uint256 issuedAt
    );
    event CertificateRevoked(uint256 indexed tokenId);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
}

#[storage]
pub struct CertificateData {
    student_name:    StorageString,
    course_name:     StorageString,
    grade:           StorageString,
    institution:     StorageString,
    issued_at:       StorageU256,
    is_valid:        StorageBool,
}

#[storage]
#[entrypoint]
pub struct BlockchainCertificate {
    owner_of:        StorageMap<U256, StorageAddress>,
    balances:        StorageMap<Address, StorageU256>,
    certificates:    StorageMap<U256, CertificateData>,
    admin:           StorageAddress,
    token_counter:   StorageU256,
}

#[public]
impl BlockchainCertificate {

    pub fn initialize(&mut self) -> Result<(), Vec<u8>> {
        self.admin.set(msg::sender());
        self.token_counter.set(U256::from(0));
        Ok(())
    }

    pub fn issue_certificate(
        &mut self,
        recipient:    Address,
        student_name: String,
        course_name:  String,
        grade:        String,
        institution:  String,
    ) -> Result<U256, Vec<u8>> {
        if msg::sender() != self.admin.get() {
            return Err(b"Only admin can issue certificates".to_vec());
        }
        let token_id = self.token_counter.get() + U256::from(1);
        self.token_counter.set(token_id);
        self.owner_of.setter(token_id).set(recipient);
        let bal = self.balances.get(recipient);
        self.balances.setter(recipient).set(bal + U256::from(1));
        let mut cert = self.certificates.setter(token_id);
        cert.student_name.set_str(&student_name);
        cert.course_name.set_str(&course_name);
        cert.grade.set_str(&grade);
        cert.institution.set_str(&institution);
        cert.issued_at.set(U256::from(stylus_sdk::block::timestamp()));
        cert.is_valid.set(true);
        evm::log(CertificateIssued {
            tokenId:     token_id,
            recipient,
            studentName: student_name,
            courseName:  course_name,
            grade,
            issuedAt:    U256::from(stylus_sdk::block::timestamp()),
        });
        evm::log(Transfer {
            from:    Address::ZERO,
            to:      recipient,
            tokenId: token_id,
        });
        Ok(token_id)
    }

    pub fn revoke_certificate(&mut self, token_id: U256) -> Result<(), Vec<u8>> {
        if msg::sender() != self.admin.get() {
            return Err(b"Only admin can revoke certificates".to_vec());
        }
        let mut cert = self.certificates.setter(token_id);
        cert.is_valid.set(false);
        evm::log(CertificateRevoked { tokenId: token_id });
        Ok(())
    }

    pub fn verify_certificate(
        &self,
        token_id: U256,
    ) -> Result<(String, String, String, String, U256, bool), Vec<u8>> {
        let owner = self.owner_of.get(token_id);
        if owner == Address::ZERO {
            return Err(b"Certificate does not exist".to_vec());
        }
        let cert = self.certificates.getter(token_id);
        Ok((
            cert.student_name.get_string(),
            cert.course_name.get_string(),
            cert.grade.get_string(),
            cert.institution.get_string(),
            cert.issued_at.get(),
            cert.is_valid.get(),
        ))
    }

    pub fn balance_of(&self, owner: Address) -> Result<U256, Vec<u8>> {
        Ok(self.balances.get(owner))
    }

    pub fn owner_of_token(&self, token_id: U256) -> Result<Address, Vec<u8>> {
        let owner = self.owner_of.get(token_id);
        if owner == Address::ZERO {
            return Err(b"Token does not exist".to_vec());
        }
        Ok(owner)
    }

    pub fn total_supply(&self) -> Result<U256, Vec<u8>> {
        Ok(self.token_counter.get())
    }

    pub fn get_admin(&self) -> Result<Address, Vec<u8>> {
        Ok(self.admin.get())
    }
}
