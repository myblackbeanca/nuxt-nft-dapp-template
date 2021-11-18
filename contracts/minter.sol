//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract MyContract is ERC721, EIP712, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    using Strings for uint256;
    using Address for address;

    // using ECDSA for bytes32;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public constant TOKEN_PRICE = 50000000000000000; //0.05 ETH
    uint256 public constant COLLECTION_SIZE = 15;
    uint public constant TOKEN_PER_PERSON_LIMIT = 1; // only 1 token per address
    uint private _setAsideTokenCount = 5;
    bool public isSaleActive = false;
    bool public isPreSaleActive = false;
    
    bool private _canReveal = false;
    string private _hiddenURI;
    string private _baseUri;
    address private _owner;

    constructor(string memory delayedRevealURI, string memory baseUri) 
        ERC721("MyContract", "MC")
        EIP712("MyContract", "1") {
            _setupRole(MINTER_ROLE, msg.sender);
            _hiddenURI = delayedRevealURI;
            _baseUri = baseUri;
            _owner = msg.sender;
            
            console.log("init", _hiddenURI, _baseUri, block.chainid);
            console.logAddress(msg.sender);
            
            _setAside();
        }

    /// @notice Represents an un-minted NFT, which has not yet been recorded into the blockchain. A signed voucher can be redeemed for a real NFT using the redeem function.
    struct NFTVoucher {
        address redeemer;
        bool whitelisted;
    }

    function _setAside() internal {
        for(uint256 index = 0; index < _setAsideTokenCount; index++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();

            console.log("setAside minting token:", newItemId);

            _safeMint(_owner, newItemId);
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// @dev override base uri. It will be combined with token ID
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseUri;
    }

    /// @notice Set hidden metadata uri
    function setHiddenUri(string memory uri) onlyRole(MINTER_ROLE) external {
        _hiddenURI = uri;
    }

    /// @notice Set base uri
    function setBaseUri(string memory uri) onlyRole(MINTER_ROLE) external {
        _baseUri = uri;
    }

    /// @notice Flip public sale
    function flipSaleState() onlyRole(MINTER_ROLE) external {
        isSaleActive = !isSaleActive;
        if(isSaleActive) {
            isPreSaleActive = false;
        }
    }

    /// @notice Flip presale
    function flipPresaleState() onlyRole(MINTER_ROLE) external {
        isPreSaleActive = !isPreSaleActive;
    }

    /// @notice Reveal metadata for all the tokens
    function reveal() onlyRole(MINTER_ROLE) external {
        _canReveal = true;
    }

    /// @notice Get contract's balance
    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Get token's URI. In case of delayed reveal we give user the json of the placeholer metadata.
    /// @param tokenId token ID
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();

        if(msg.sender == _owner || _canReveal) {
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
        }

        return _hiddenURI;
    }

    /// @notice Withdraw's contract's balance to the minter's address
    function withdraw() external onlyRole(MINTER_ROLE) {
        require(balance() > 0, "No balance");

        address payable owner = payable(msg.sender);
        owner.transfer(balance());
    }

    /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.
    /// @dev https://gist.github.com/JofArnold/bf2c4a094fcdd4aee2f52983c7714de8#file-boredapeyachtclub-sol-L1906
    /// @dev https://github.com/OpenZeppelin/workshops/tree/master/06-nft-merkle-drop
    /// @dev https://github.com/yusefnapora/lazy-minting/tree/master/lazy-mint-example
    /// @param voucher An NFTVoucher that describes the NFT to be redeemed.
    /// @param signer address of the signer
    /// @param signature An EIP712 signature of the voucher, produced by the NFT creator.
    function redeem(NFTVoucher calldata voucher, address signer, bytes memory signature) public payable returns (uint256) {
       
        console.logAddress(signer);
        console.logBytes(signature);

        require(_verify(signer, _hash(voucher), signature), "Invalid signature");
        require(_tokenIds.current() < COLLECTION_SIZE, "All tokens have been minted");
        require(balanceOf(voucher.redeemer) < TOKEN_PER_PERSON_LIMIT, string(abi.encodePacked("Only ", TOKEN_PER_PERSON_LIMIT, " token(s) per user")));
        require(TOKEN_PRICE <= msg.value, "Ether value sent is not sufficient");

        if(isPreSaleActive) {
            require(voucher.whitelisted, "Presale is only open to whitelisted users");
        }
        else {
            require(isSaleActive, "Sale must be active to mint");
        }

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // first assign the token to the signer, to establish provenance on-chain
        _safeMint(signer, newItemId);
        
        // transfer the token to the redeemer
        _transfer(signer, voucher.redeemer, newItemId);

        // record payment to contract's balance - dont need to do this, payment is automatically recorded to the contract's balance
        // payable(address(this)).transfer(msg.value);

        return newItemId;
    }

    /// @notice Returns a hash of the given NFTVoucher, prepared using EIP712 typed data hashing rules.
    /// @param voucher An NFTVoucher to hash.
    function _hash(NFTVoucher calldata voucher)
    internal view returns (bytes32)
    {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256("NFTVoucher(address redeemer,bool whitelisted)"),
            voucher.redeemer,
            voucher.whitelisted
        )));

        // address recoveredSigner = ECDSA.recover(hash, signature);
        // return recoveredSigner == signer;
    }

    function _verify(address signer, bytes32 digest, bytes memory signature)
    internal view returns (bool)
    {
        console.log("signer has minter role:", hasRole(MINTER_ROLE, signer));
        return hasRole(MINTER_ROLE, signer) && SignatureChecker.isValidSignatureNow(signer, digest, signature);
    }
}
