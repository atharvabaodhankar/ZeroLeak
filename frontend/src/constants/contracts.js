export const EXAM_REGISTRY_ADDRESS = "0x861Dd603C4202dA59856F1eeE7c3BCa41d9eD727";

export const EXAM_REGISTRY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "examCenter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ExamCenterRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "paperId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "unlockTimestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "roomNumber",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "authority",
        "type": "address"
      }
    ],
    "name": "PaperScheduled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "paperId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "roomNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PaperUnlocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "paperId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "examName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "teacher",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PaperUploaded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "examCenterPublicKeys",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_examCenter",
        "type": "address"
      }
    ],
    "name": "getExamCenterPublicKey",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_paperId",
        "type": "uint256"
      }
    ],
    "name": "getPaper",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "examName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "subject",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "teacher",
            "type": "address"
          },
          {
            "internalType": "string[]",
            "name": "ipfsCIDs",
            "type": "string[]"
          },
          {
            "internalType": "bytes",
            "name": "encryptedKey",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "uploadTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "unlockTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "roomNumber",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isScheduled",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isUnlocked",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "authority",
            "type": "address"
          }
        ],
        "internalType": "struct ExamRegistry.Paper",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_paperId",
        "type": "uint256"
      }
    ],
    "name": "getPaperCIDs",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_paperId",
        "type": "uint256"
      }
    ],
    "name": "isPaperUnlocked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paperCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "papers",
    "outputs": [
      {
        "internalType": "string",
        "name": "examName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "subject",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "teacher",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "encryptedKey",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "uploadTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "unlockTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "roomNumber",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isScheduled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isUnlocked",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "authority",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_publicKey",
        "type": "bytes"
      }
    ],
    "name": "registerExamCenter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_paperId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_unlockTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_roomNumber",
        "type": "string"
      }
    ],
    "name": "scheduleExam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_paperId",
        "type": "uint256"
      }
    ],
    "name": "unlockPaper",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_examName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_subject",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_ipfsCIDs",
        "type": "string[]"
      },
      {
        "internalType": "bytes",
        "name": "_encryptedKey",
        "type": "bytes"
      }
    ],
    "name": "uploadPaper",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
