const { ethers } = require('ethers');
require('dotenv').config()
console.log(process.env.privateKey); // 应该输出你的私钥值
const apiKey = process.env.apiKey
const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/" + apiKey)
const contractABI = [
        {
            "type": "constructor",
            "inputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "receive",
            "stateMutability": "payable",
            "payable": true
        },
        {
            "type": "function",
            "name": "contribute",
            "inputs": [],
            "outputs": [],
            "stateMutability": "payable",
            "payable": true,
            "signature": "0xd7bb99ba"
        },
        {
            "type": "function",
            "name": "contributions",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view",
            "constant": true,
            "signature": "0x42e94c90"
        },
        {
            "type": "function",
            "name": "getContribution",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view",
            "constant": true,
            "signature": "0xf10fdf5c"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view",
            "constant": true,
            "signature": "0x8da5cb5b"
        },
        {
            "type": "function",
            "name": "withdraw",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable",
            "signature": "0x3ccfd60b"
        }
];
const contractAddress = "0x9A438513b4e5BCFf61Ced3077efe3CD804d81e68";
const privateKey = process.env.privateKey;

const wallet = new ethers.Wallet(privateKey, provider)

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function getOwner() {
    const amountToSend = ethers.utils.parseEther("0.0001")
    const contributeReturn = await contract.contribute({ value: amountToSend });
    const receipt = await contributeReturn.wait();
    
    if (receipt.status === 1) {
        const transction = {
            to: contractAddress,
            value: ethers.utils.parseEther("0.0001")
        }
        const txResponse = await wallet.sendTransaction(transction);
        const receipt = await txResponse.wait();
        console.log(receipt.status)
        const owner = await contract.owner();
        console.log("The owner of the contract is:", owner)
    }
}

async function withdraw() {
    withdrawResponse = await contract.withdraw()
    const receipt = await withdrawResponse.wait();
    console.log(receipt.status)
}

function listenToEvents() {
    contract.on('Received', (sender, amount, event) => {
        console.log(`Received event! Sent by ${sender}: ${ethers.utils.formatEther(amount)} ETH`);
        console.log(event); // 更详细的事件信息
    });
}

async function run() {
    // await getOwner();
    // 如果需要，之后可以调用withdraw或监听事件
    await withdraw();
    // listenToEvents();
}

run().catch(console.error);
