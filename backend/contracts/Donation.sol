// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./VoteMajority.sol";

contract Donation is VoteMajority {
    
    // define admin role addresses
    constructor(address[] memory _admins) VoteMajority(_admins) {}


    event DonationToAssociation(address donor, address addrAssociation, uint mount);


    // ################# Association ###################76

    function setAssociationForm(
        string memory _name,
        string memory _activity,
        string memory _goal,
        string memory _localisation,
        string memory _officialWebsite
        ) external {

        require(associations[msg.sender].isRegister, "You are not register");
        associations[msg.sender].name = _name;
        associations[msg.sender].activity = _activity;
        associations[msg.sender].goal = _goal;
        associations[msg.sender].localisation = _localisation;
        associations[msg.sender].officialWebsite = _officialWebsite;
   
    }

   
    function registerNewAssociation(
        address _addr,
        string memory _name,
        string memory _activity,
        string memory _goal,
        string memory _localisation,
        string memory _officialWebsite
    ) external {
        require(!associations[_addr].onStandBy, "Your request is pending");
        require(associationsOnStandby.length < 100, 'Too many requests please try later');
        require(keccak256(bytes(_name)) != keccak256(bytes('')) &&
                keccak256(bytes(_activity)) != keccak256(bytes('')) &&
                keccak256(bytes(_goal)) != keccak256(bytes('')) &&
                keccak256(bytes(_localisation)) != keccak256(bytes('')) &&
                keccak256(bytes(_officialWebsite)) != keccak256(bytes('')), 'Empty fields are not allowed');
        
        associationsOnStandby.push(_addr);
        associations[_addr] = InfosAssociation(_name, _activity, _goal, _localisation, _officialWebsite, false, true);
    }



    // ################# USER ###################

    function getAllAssociations() external view returns(InfosAssociation[] memory) {
        InfosAssociation[] memory _associations = new InfosAssociation[](associationAccepted.length);

        for (uint i = 0; i < associationAccepted.length; i++) {
            address addressAssociation = associationAccepted[i];
            if(associations[addressAssociation].isRegister){
                _associations[i] = _fetchAssociation(addressAssociation);
            }
        }

        return _associations;
    }

    function getAssociationsAtInterval(uint startIndex, uint count) external view returns(InfosAssociation[] memory )  {

        
        uint totalAssociations = associationAccepted.length; // Obtenez le nombre total d'associations

        if (startIndex >= totalAssociations || count == 0) {
            return new InfosAssociation[](0);
        }

        uint numAssociations = count;
        if (startIndex + count > totalAssociations) {
            numAssociations = totalAssociations - startIndex;
        }

        // Allouez un tableau pour stocker les associations à renvoyer
        InfosAssociation[] memory _associations = new InfosAssociation[](numAssociations);

        // Récupérez les associations à partir de l'index de départ
        for (uint i = 0; i < numAssociations; i++) {
            address addressAssociation = associationAccepted[startIndex + i];

            if(associations[addressAssociation].isRegister){
                _associations[i] = _fetchAssociation(addressAssociation);
            }
        }

        return _associations;
    }

    function _fetchAssociation(address _address) public view returns (InfosAssociation memory) {
        require( associations[_address].isRegister, 'Address is unknown or banned');
        return associations[_address];
    }

   

 
    function donate(address payable _address) external payable {
        require(msg.value > 0, "Not enough funds provided");
        require(associations[_address].isRegister, 'Address is unknown or banned');

        (bool sent, ) = _address.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit DonationToAssociation(msg.sender, _address, msg.value);
    }

}