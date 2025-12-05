pragma solidity ^0.8.20;
// SPDX-License-Identifier: MIT

/**
 * @title ExamRegistry
 * @dev Manages exam paper uploads, scheduling, and time-locked access
 */
contract ExamRegistry {
    struct Paper {
        string examName;
        string subject;
        address teacher;
        string[] ipfsCIDs;        // Encrypted chunks on IPFS
        bytes encryptedKey;       // AES key encrypted with exam center's public key
        uint256 uploadTimestamp;
        uint256 unlockTimestamp;
        string roomNumber;
        bool isScheduled;
        bool isUnlocked;
        address authority;        // Who scheduled it
    }
    
    // State variables
    mapping(uint256 => Paper) public papers;
    uint256 public paperCount;
    
    // Exam center public keys (registered during onboarding)
    mapping(address => bytes) public examCenterPublicKeys;
    
    // Events
    event PaperUploaded(
        uint256 indexed paperId,
        string examName,
        address indexed teacher,
        uint256 timestamp
    );
    
    event PaperScheduled(
        uint256 indexed paperId,
        uint256 unlockTimestamp,
        string roomNumber,
        address indexed authority
    );
    
    event PaperUnlocked(
        uint256 indexed paperId,
        string roomNumber,
        uint256 timestamp
    );
    
    event ExamCenterRegistered(
        address indexed examCenter,
        uint256 timestamp
    );
    
    // Modifiers
    modifier validPaper(uint256 _paperId) {
        require(_paperId > 0 && _paperId <= paperCount, "Invalid paper ID");
        _;
    }
    
    /**
     * @dev Teacher uploads a paper
     * @param _examName Name of the exam
     * @param _subject Subject of the exam
     * @param _ipfsCIDs Array of IPFS CIDs for encrypted chunks
     * @param _encryptedKey AES key encrypted with exam center's public key
     * @return paperId The ID of the uploaded paper
     */
    function uploadPaper(
        string memory _examName,
        string memory _subject,
        string[] memory _ipfsCIDs,
        bytes memory _encryptedKey
    ) external returns (uint256) {
        require(bytes(_examName).length > 0, "Exam name required");
        require(_ipfsCIDs.length > 0, "At least one IPFS CID required");
        require(_encryptedKey.length > 0, "Encrypted key required");
        
        paperCount++;
        
        papers[paperCount] = Paper({
            examName: _examName,
            subject: _subject,
            teacher: msg.sender,
            ipfsCIDs: _ipfsCIDs,
            encryptedKey: _encryptedKey,
            uploadTimestamp: block.timestamp,
            unlockTimestamp: 0,
            roomNumber: "",
            isScheduled: false,
            isUnlocked: false,
            authority: address(0)
        });
        
        emit PaperUploaded(paperCount, _examName, msg.sender, block.timestamp);
        return paperCount;
    }
    
    /**
     * @dev Authority schedules an exam
     * @param _paperId ID of the paper to schedule
     * @param _unlockTimestamp When the paper should unlock (Unix timestamp)
     * @param _roomNumber Room where exam will be conducted
     */
    function scheduleExam(
        uint256 _paperId,
        uint256 _unlockTimestamp,
        string memory _roomNumber
    ) external validPaper(_paperId) {
        Paper storage paper = papers[_paperId];
        
        require(!paper.isScheduled, "Paper already scheduled");
        require(_unlockTimestamp > block.timestamp, "Unlock time must be in future");
        require(bytes(_roomNumber).length > 0, "Room number required");
        
        paper.unlockTimestamp = _unlockTimestamp;
        paper.roomNumber = _roomNumber;
        paper.isScheduled = true;
        paper.authority = msg.sender;
        
        emit PaperScheduled(_paperId, _unlockTimestamp, _roomNumber, msg.sender);
    }
    
    /**
     * @dev Unlock a paper (can be called by anyone after unlock time)
     * @param _paperId ID of the paper to unlock
     */
    function unlockPaper(uint256 _paperId) external validPaper(_paperId) {
        Paper storage paper = papers[_paperId];
        
        require(paper.isScheduled, "Paper not scheduled");
        require(!paper.isUnlocked, "Paper already unlocked");
        require(block.timestamp >= paper.unlockTimestamp, "Too early to unlock");
        
        paper.isUnlocked = true;
        
        emit PaperUnlocked(_paperId, paper.roomNumber, block.timestamp);
    }
    
    /**
     * @dev Exam center registers their public key
     * @param _publicKey Public key for encrypting paper keys
     */
    function registerExamCenter(bytes memory _publicKey) external {
        require(_publicKey.length > 0, "Public key required");
        
        examCenterPublicKeys[msg.sender] = _publicKey;
        
        emit ExamCenterRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get paper details
     * @param _paperId ID of the paper
     * @return Paper struct
     */
    function getPaper(uint256 _paperId) external view validPaper(_paperId) returns (Paper memory) {
        return papers[_paperId];
    }
    
    /**
     * @dev Get all IPFS CIDs for a paper
     * @param _paperId ID of the paper
     * @return Array of IPFS CIDs
     */
    function getPaperCIDs(uint256 _paperId) external view validPaper(_paperId) returns (string[] memory) {
        return papers[_paperId].ipfsCIDs;
    }
    
    /**
     * @dev Check if a paper is unlocked
     * @param _paperId ID of the paper
     * @return bool indicating if paper is unlocked
     */
    function isPaperUnlocked(uint256 _paperId) external view validPaper(_paperId) returns (bool) {
        return papers[_paperId].isUnlocked;
    }
    
    /**
     * @dev Get exam center's public key
     * @param _examCenter Address of the exam center
     * @return Public key bytes
     */
    function getExamCenterPublicKey(address _examCenter) external view returns (bytes memory) {
        return examCenterPublicKeys[_examCenter];
    }
}
