ethernaut通关挑战-1



# 简介

1. **一句话说明该如何学习coding：迅速阅览一遍语法文档，然后直接进行学习代码中最有意思的部分：实现需求**



2. 推荐教材：

   2.1 https://www.wtf.academy/docs/solidity-101/  比较口语化的教材，会讲到solidity的关键部分，但细节还需要自己翻文档

   2.2 https://docs.soliditylang.org/zh/latest/introduction-to-smart-contracts.html solidity中文文档，很全，简单过一遍就好，在项目开发中，遇到问题，再翻文档看细节



3. 什么是ethernut？

一个智能合约安全的靶场，有一些经典的漏洞可以让你练习如何hack合约，从而对智能合约安全有更深入的理解



# Ethernaut

ethernut第一关

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fallback {
    mapping(address => uint256) public contributions; 
    address public owner;

    constructor() {
        owner = msg.sender;
        contributions[msg.sender] = 1000 * (1 ether);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function contribute() public payable {
        require(msg.value < 0.001 ether);
        contributions[msg.sender] += msg.value;
        if (contributions[msg.sender] > contributions[owner]) {
            owner = msg.sender; //这里涉及到权限所有者的变动，是最有可能出问题的地方
        }
    }

    function getContribution() public view returns (uint256) {
        return contributions[msg.sender];
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {
        require(msg.value > 0 && contributions[msg.sender] > 0); 
        owner = msg.sender; //这里涉及到权限所有者的变动，是最有可能出问题的地方
    }
}
```



我们需要做的更改合约的权限，同时把合约所有的eth提走

阅读合约，我们可知，当contributtions这个mapping里的合约调用人向这个合约转入的eth的数量超过合约owner的话，合约owner就会变成msg.sender

所以，我们的思路如下



首先，我们向这个合约转入0.0005eth，数量不重要，只要确保小于 0.001就可以，在mapping里记录下我们的地址，然后直接向合约转入任意数量eth，即可拿到合约权限















