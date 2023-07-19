// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./VoteMajority.sol";

contract Donation is VoteMajority {
    
    // define admin role addresses
    constructor(address[] memory _admins) VoteMajority(_admins) {}


    event AssociationRegistered(address associationAddress);
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
        associations[msg.sender] = InfosAssociation(_name, _activity, _goal, _localisation, _officialWebsite, true);
   
    }

   
    function registerNewAssociation(
        address _addr,
        string memory _name,
        string memory _activity,
        string memory _goal,
        string memory _localisation,
        string memory _officialWebsite
    ) external {
        require(!associations[_addr].isRegister, "You are already register");
        require(associationsOnStandby.length < 100, 'Too many requests please try later');
        associationsOnStandby.push(_addr);
        associations[_addr] = InfosAssociation(_name, _activity, _goal, _localisation, _officialWebsite, true);
    }


     

    function AuditsAssociations() external  onlyRole(ADMIN_ROLE) {

    }


    // ################# USER ###################

    function getAllAssociations() external view returns(InfosAssociation[] memory) {
        InfosAssociation[] memory _associations = new InfosAssociation[](associationAccepted.length);

        for (uint i = 0; i < associationAccepted.length; i++) {
            address addressAssociation = associationAccepted[i];
            _associations[i] = _fetchAssociation(addressAssociation);
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
            _associations[i] = _fetchAssociation(addressAssociation);
        }

        return _associations;
    }

    function _fetchAssociation(address _address) public view returns (InfosAssociation memory) {
        return associations[_address];
    }

   

    // En tant qu'utilisateur, je veux pouvoir consulter les informations financières 
    // d'une association, y compris ses revenus et ses dépenses. Les associations devront 
    // justifier toutes leurs actions financière sur la DAO chaque mois, si non effectué mise ne pause 
    // des donations pour l’association et si 6 mois sans justificatif exclusion de l’association.
    // + fiche association
    // + Infos projets associations
    // ???/ Accès aux rapports
    function getDetailAssociation (address _address) external {

    }


    function donate(address payable _address, uint mount) external payable {
        require(msg.value > 0, "Not enough funds provided");
        require(associations[_address].isRegister, 'Address is unknown');

        (bool sent, ) = _address.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit DonationToAssociation(msg.sender, _address, mount);
    }

    function myDonationsHistory() external {
        // retracer les events ?

    }


    // ################# Pour les donateurs ###################

    function commentAssociation () external {

    }

    // En tant qu'utilisateur, je veux pouvoir recommander de nouvelles 
    // associations à ajouter à la DAO grâce à l’accès personnalisé à la page des candidatures
    //  associatives et la possibilité de mettre 
    //  un vote positif ou négatif sur chaque association.






}