// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";


contract VoteMajority is AccessControlEnumerable {


    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint totalAdmins;


    // ------------------ ASSOCIATIONS INFORMATIONS --------------------- //

    struct InfosAssociation {
        string name;
        string activity;
        string goal;
        string localisation;
        string officialWebsite;
        bool isRegister;
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
        bool isAccepted;
        bool isActive;
    }

    struct Admin {
        bool hasVoted;
        bool hasApproved;
    }
    // a session is define by an address
    mapping(address => Session) public sessions;

    // session address => admin address => ses infos
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
        require(keccak256(bytes(_name)) == keccak256(bytes('association')) || keccak256(bytes(_name)) == keccak256(bytes('admin')), "Name is unknown choose association or admins");
        sessions[_addressSession] = Session(_name, 0, totalAdmins, false, true);
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

        sessions[_addrSession].isActive = false;
        sessions[_addrSession].isAccepted =  result;

        if(result) {
            if(keccak256(bytes(sessions[_addrSession].name)) == keccak256(bytes('admin'))) {
                _grantRole(ADMIN_ROLE, _addrSession);
            } else if(keccak256(bytes(sessions[_addrSession].name)) == keccak256(bytes('association'))) {
                associationAccepted.push(_addrSession);
                _deleteAssociationOnStandBy(_addrSession);
            }
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

    // function seeArray() public view returns(address[] memory) {
    //     return associationsOnStandby;
    // }

      
 

    // function revokeAssociation(address _address) external onlyRole(ADMIN_ROLE) {
    //     voteMajorityContract.createSession(_address, 'Revoke association');
    // }

    // function addAdmin(address _address) external onlyRole(ADMIN_ROLE) {
    //     voteMajorityContract.createSession(_address, 'Add admin');
    // } 
}
