// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";


contract VoteMajority is AccessControlEnumerable {


    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint totalAdmins;


    // ------------------ ASSOCIATIONS INFORMATIONS --------------------- //

    struct InfosAssociation {
        address addr;
        string name;
        string activity;
        string goal;
        string localisation;
        string officialWebsite;
        bool isRegister;
        bool onStandBy;
    }

    mapping(address => InfosAssociation) public associations;
    address[] public associationsOnStandby;
    address payable [] public associationAccepted;


    // ------------------ VOTING SESSION --------------------- //

    event Vote(address indexed voter, bool vote);

    // multiple session vote for admin and associations
    struct Session {
        string name;
        uint totalVotes;
        uint majorityThreshold;
        bool isActive;
    }

    struct Admin {
        bool hasVoted;
        bool hasApproved;
    }
    // a session is define by an address
    mapping(address => Session) public sessions;

    // session address => admin address => his infos
    mapping(address => mapping(address => Admin)) public sessionAdmin;



    // ------------------ CODE --------------------- //

    constructor(address[] memory _admins) {
        
        totalAdmins = _admins.length;
        for (uint256 i = 0; i < totalAdmins; ++i) {
            _grantRole(ADMIN_ROLE, _admins[i]);
        }
        
    }
    
    function createSession(address _addressSession, string memory _name) external onlyRole(ADMIN_ROLE) {
        require(!sessions[_addressSession].isActive, "Session already register");
        require(keccak256(bytes(_name)) == keccak256(bytes('association')) || 
                keccak256(bytes(_name)) == keccak256(bytes('admin')) || 
                keccak256(bytes(_name)) == keccak256(bytes('revokeAssociation')), "Name is unknown choose association or admins");
                
                
        if(keccak256(bytes(_name)) == keccak256(bytes('association'))) {
            require(associations[_addressSession].onStandBy, "Association has not applied for registration");
        }
        else if(keccak256(bytes(_name)) == keccak256(bytes('revokeAssociation'))) {
            require(associations[_addressSession].isRegister, "Association is not register");
        }

        sessions[_addressSession] = Session(_name, 0, totalAdmins, true);
    }

 
    function vote(address payable _addrSession, bool _vote) external onlyRole(ADMIN_ROLE) {
        require(sessions[_addrSession].isActive, "Voting is finished.");
        require(!sessionAdmin[_addrSession][msg.sender].hasVoted, "You have already voted.");

        sessionAdmin[_addrSession][msg.sender].hasVoted = true;
        sessionAdmin[_addrSession][msg.sender].hasApproved = _vote;

        sessions[_addrSession].totalVotes ++;

        emit Vote(msg.sender, _vote);

        if (sessions[_addrSession].totalVotes >= sessions[_addrSession].majorityThreshold) {
            finishVoting(_addrSession);
        }
    }

    function finishVoting(address payable _addrSession) internal {
        uint256 yesVotes = 0;
        uint256 noVotes = 0;

        for (uint256 i = 0; i < totalAdmins; i++) {
            address admin = getRoleMember(ADMIN_ROLE, i);
            if (sessionAdmin[_addrSession][admin].hasApproved == true) {
                yesVotes++;
            } else {
                noVotes++;
            }
        }

        bool result = yesVotes > noVotes;

        bytes32 sessionName = keccak256(bytes(sessions[_addrSession].name));
        if(result) {
            if(sessionName == keccak256(bytes('admin'))) {
                _grantRole(ADMIN_ROLE, _addrSession);
            } else if(sessionName == keccak256(bytes('association'))) {
                associationAccepted.push(_addrSession);
                associations[_addrSession].isRegister = true;
            } else if(sessionName == keccak256(bytes('revokeAssociation'))) {
                associations[_addrSession].isRegister = false;
            }
        }

        if(sessionName == keccak256(bytes('association'))) {
            associations[_addrSession].onStandBy = false;
            _deleteAssociationOnStandBy(_addrSession);
        }

        // reset session
        sessions[_addrSession] = Session('', 0, totalAdmins, false);

       // reset vote admin
       for(uint i; i< totalAdmins; i++) {
            address admin = getRoleMember(ADMIN_ROLE, i);
            sessionAdmin[_addrSession][admin].hasVoted = false;
            sessionAdmin[_addrSession][admin].hasApproved = false;
       }
    }

    function _deleteAssociationOnStandBy(address _address) private {
        for (uint256 i = 0; i < associationsOnStandby.length; i++) {
            if (associationsOnStandby[i] == _address) {
                // Déplacer les éléments suivants vers la gauche
                for (uint256 j = i; j < associationsOnStandby.length - 1; j++) {
                    associationsOnStandby[j] = associationsOnStandby[j + 1];
                }
                // Réduire la taille du tableau
                associationsOnStandby.pop();
                break;
            }
        }
    }
 
}
