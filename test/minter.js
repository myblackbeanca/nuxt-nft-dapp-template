const { expect } = require("chai");

describe("MyContract contract", function () {

    let Token;
    let hardhatToken;
    let owner;

    beforeEach(async function () {
        Token = await ethers.getContractFactory("MyContract");
        
        hardhatToken = await Token.deploy();

        [owner] = await ethers.getSigners();
    })

    describe("Deployment", function () {
        it("Deployment should set default values", async function () {
        
            const TOKEN_PRICE = await hardhatToken.TOKEN_PRICE();
            const MAX_TOKENS = await hardhatToken.MAX_TOKENS();
            const isSaleActive = await hardhatToken.isSaleActive();

            console.log(ethers.utils.formatUnits(TOKEN_PRICE), +MAX_TOKENS, isSaleActive);
        
            expect(ethers.utils.formatUnits(TOKEN_PRICE)).to.equal('0.05');
            expect(+MAX_TOKENS).to.equal(1500);
            expect(isSaleActive).to.equal(false);        
        })
    })

    describe("Functions", function () {
        it("Flips the sale status", async function () {
        
            let isSaleActive = await hardhatToken.isSaleActive();
        
            expect(isSaleActive).to.equal(false);

            await hardhatToken.flipSaleState();

            isSaleActive = await hardhatToken.isSaleActive();
        
            expect(isSaleActive).to.equal(true);
        })
    })
    
});