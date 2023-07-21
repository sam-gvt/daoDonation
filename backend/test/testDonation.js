const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

let admins = [];

describe("Donation Contract Test", function () {

    async function deployDonationFixture() {
  
     const [owner, otherAccount, addr1, addr2, addr3] = await ethers.getSigners();

     admins = [owner, addr1, addr2];

     const hardhatContract = await ethers.deployContract("Donation", [admins]);

     await hardhatContract.waitForDeployment();

     return {hardhatContract, owner, otherAccount, addr1, addr2, addr3};
    }


    describe('When association is on standBy', function() {

        let _hardhatContract;
        let _otherAccount;
        let _owner;
        let _addr3;
        beforeEach(async () => {
            const {hardhatContract, otherAccount, owner, addr1, addr2, addr3} = await loadFixture(deployDonationFixture);
            _hardhatContract = hardhatContract;
            _otherAccount = otherAccount;
            _owner = owner;
            _addr3 = addr3;

            await _hardhatContract.registerNewAssociation(
                _otherAccount,
                'name',
                'activity',
                'goal',
                'localisation',
                'officialWebsite'
                );            
         })

         it('I can apply to register my association', async function() {
            expect((await _hardhatContract.associationsOnStandby(0)).toLowerCase()).to.equal(_otherAccount.address.toLowerCase());
         })

         it("I can register association with empty informations", async () => {
             await expect(_hardhatContract.registerNewAssociation(
                _addr3,
                '',
                'activity',
                'goal',
                '',
                'officialWebsite'
            )).to.be.revertedWith("Empty fields are not allowed");
        });
 
         it('Revert if I add association existing', async function() {
             
             await expect(_hardhatContract.registerNewAssociation(
                 _otherAccount,
                 'name',
                 'activity',
                 'goal',
                 'localisation',
                 'officialWebsite'
             )).to.be.revertedWith("Your request is pending");
         })

         it('I can create session vote for association', async function() {
            await _hardhatContract.createSession(_otherAccount, 'association');
         })

         it('I can create session vote for admin', async function() {
            await _hardhatContract.createSession(_otherAccount, 'admin');
         })

         it('I cannot create the same voting session twice', async function() {
            await _hardhatContract.createSession(_otherAccount, 'admin');
            await expect( _hardhatContract.createSession(_otherAccount, 'test nom Session')).to.be.revertedWith("Session already register");
         })

         it('I can not create a session with a name that is not association or admin or revokeAssociation', async function() {
            await expect(_hardhatContract.createSession(_otherAccount, 'test nom Session')).to.be.revertedWith("Name is unknown choose association or admins");

         })

         it('I can vote for a session, geet event Vote', async function() {
            await _hardhatContract.createSession(_otherAccount, 'admin');
            const vote = await _hardhatContract.vote(_otherAccount, true)
            
            expect((await _hardhatContract.sessions(_otherAccount)).totalVotes).to.equal(1);
            expect((await _hardhatContract.sessionAdmin(_otherAccount, _owner)).hasApproved).to.equal(true);
            expect((await _hardhatContract.sessionAdmin(_otherAccount, _owner)).hasVoted).to.equal(true);

            await expect(vote).to.emit(_hardhatContract, "Vote");


         })

         it('When the session is finish, it is reset ', async function() {
            await _hardhatContract.createSession(_otherAccount, 'admin');
            // all admin vote true
            for(i = 0; i < admins.length; i ++) {
                await _hardhatContract.connect(admins[i]).vote(_otherAccount, true);
            }
            expect((await _hardhatContract.sessions(_otherAccount)).name).to.equal('');
            expect((await _hardhatContract.sessions(_otherAccount)).totalVotes).to.equal(0);
            expect((await _hardhatContract.sessions(_otherAccount)).majorityThreshold).to.equal(admins.length);
            expect((await _hardhatContract.sessions(_otherAccount)).isActive).to.equal(false);
         })

         it('I can not vote twice for the same session', async function() {
            await _hardhatContract.createSession(_otherAccount, 'admin');
            await _hardhatContract.vote(_otherAccount, true);

            await expect(_hardhatContract.vote(_otherAccount, true)).to.be.revertedWith("You have already voted.");

         })

         it('Only admin can create and vote to a session', async function() {
            // _addr3 is not in the admin list
            await expect(_hardhatContract.connect(_addr3).createSession(_otherAccount, 'admin')).to.be.revertedWith(`AccessControl: account ${_addr3.address.toLowerCase()} is missing role 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`);
            await expect(_hardhatContract.connect(_addr3).vote(_otherAccount, true)).to.be.revertedWith(`AccessControl: account ${_addr3.address.toLowerCase()} is missing role 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`);
         })

        
         it('When the last admin has voted association, if result is true : register it', async function() {
            
            await _hardhatContract.createSession(_otherAccount, 'association');

            //first admin vote false, the rest vote true
            await _hardhatContract.connect(admins[0]).vote(_otherAccount, false);
            for(i = 1; i < admins.length; i ++) {
                await _hardhatContract.connect(admins[i]).vote(_otherAccount, true);
            }
            
            expect(await _hardhatContract.associationAccepted(0)).to.equal(_otherAccount.address);
         })

         it('When the last admin has voted association, if result is false : don t register it', async function() {
            await _hardhatContract.createSession(_otherAccount, 'association');

            //first admin vote true, the rest vote false
            await _hardhatContract.connect(admins[0]).vote(_otherAccount, true);
            for(i = 1; i < admins.length; i ++) {
                await _hardhatContract.connect(admins[i]).vote(_otherAccount, false);
            }
            expect(await _hardhatContract.associationAccepted(0).length).to.equal(undefined);
         })

         it('When the last admin has voted admin, if result is true : register it', async function() {
            await _hardhatContract.createSession(_otherAccount, 'admin');

            //first admin vote false, the rest vote true
            await _hardhatContract.connect(admins[0]).vote(_otherAccount, false);
            for(i = 1; i < admins.length; i ++) {
                await _hardhatContract.connect(admins[i]).vote(_otherAccount, true);
            }
            
            expect(await _hardhatContract.hasRole('0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775', _otherAccount)).to.equal(true);
         })

         it('When the last admin has voted admin, if result is false : don t register it', async function() {
            await _hardhatContract.createSession(_otherAccount, 'admin');

            //first admin vote true, the rest vote false
            await _hardhatContract.connect(admins[0]).vote(_otherAccount, true);
            for(i = 1; i < admins.length; i ++) {
                await _hardhatContract.connect(admins[i]).vote(_otherAccount, false);
            }
            
            expect(await _hardhatContract.hasRole('0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775', _otherAccount)).to.equal(false);
         })


    })

        
    describe('When associations is register', function() {
        let _hardhatContract;
        let _otherAccount;
        let _addr1;
        let _addr2;
        let _addr3;
        beforeEach(async () => {
            const {hardhatContract, otherAccount, addr1, addr2, addr3} = await loadFixture(deployDonationFixture);
            _hardhatContract = hardhatContract;
            _otherAccount = otherAccount;
            _addr1 = addr1;
            _addr2 = addr2;
            _addr3 = addr3;
            
            // register
            await _hardhatContract.registerNewAssociation(
                _otherAccount,
                'name',
                'activity',
                'goal',
                'localisation',
                'officialWebsite'
            );
            await _hardhatContract.registerNewAssociation(
                _addr2,
                'name',
                'activity',
                'goal',
                'localisation',
                'officialWebsite'
            );
            await _hardhatContract.registerNewAssociation(
                _addr3,
                'name',
                'activity',
                'goal',
                'localisation',
                'officialWebsite'
            );

            await _hardhatContract.createSession(_otherAccount, 'association')
            await _hardhatContract.createSession(_addr2, 'association')
            await _hardhatContract.createSession(_addr3, 'association')
            for(i = 0; i < admins.length; i ++) {
                await _hardhatContract.connect(admins[i]).vote(_otherAccount, true);
                await _hardhatContract.connect(admins[i]).vote(_addr2, true);
                await _hardhatContract.connect(admins[i]).vote(_addr3, false);
            }

         })

         it('When the last admin has voted association, delete it in array OnStandBy', async function() {
            // array is empty
            expect(await _hardhatContract.associationsOnStandby(0).length).to.equal(undefined);
         })

         it('I can launch a voting session to delete an association', async function() {
            await _hardhatContract.createSession(_otherAccount, 'revokeAssociation');
            expect((await _hardhatContract.associations(_otherAccount)).isRegister).to.equal(true);

            for(i = 0; i < admins.length; i ++) {
                await _hardhatContract.connect(admins[i]).vote(_otherAccount, true);
            }
            expect((await _hardhatContract.associations(_otherAccount)).isRegister).to.equal(false);
            
         })



         it('I can set my association form', async function() {

            await _hardhatContract.connect(_otherAccount).setAssociationForm(
                'otherName',
                'OtherActivity',
                'otherGoal',
                'otherLocalisation',
                'officialWebsite'
            )

            expect(await _hardhatContract.associations(_otherAccount)).to.deep.equal(
               [ 
                    'otherName',
                    'OtherActivity',
                    'otherGoal',
                    'otherLocalisation',
                    'officialWebsite',
                    true,
                    false,
                ]
            )
        })

                
        it('I can see the informations about an association', async function() {
            expect(await _hardhatContract._fetchAssociation(_otherAccount)).to.deep.equal(
                [ 
                    'name',
                    'activity',
                    'goal',
                    'localisation',
                    'officialWebsite',
                    true,
                    false,
                 ]
             )

        })

        it('I can see all associations register', async function() {
            expect((await _hardhatContract.getAllAssociations()).length).to.equal(2);
        })

        it('I can see a list of associations by interval (e.g. 3-5)', async function() {
            expect((await _hardhatContract.getAssociationsAtInterval(0, 2)).length).to.equal(2);

        })

        it('I can make a donation to an association', async function() {
            await expect(_hardhatContract.connect(_addr1).donate(_otherAccount.address,{ value: ethers.parseEther("1") })).to.emit(_hardhatContract, "DonationToAssociation");
        })


    })



})

