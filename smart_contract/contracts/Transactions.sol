//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; //specify version

contract Transactions {
    //beginning of the entire contract-best practice to use same name as filename
    uint256 transactionCount; //declaring variable to keep the count of transactions

    event Transfer(
        address from,
        address receiver,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    ); //an event will be fired with these params

    struct TransferStruct {
        //a struct datatype is defined as an object which is used as params in event
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions; //transactions is an array of transferStruct datatype with all its properties i.e every transaction will have both addresses, amount, timestamp etc

    function addToBlockchain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        //function to add to blockchain whatever info present in the bracket; public means can be called by anyone
        transactionCount += 1; //in this func, the transaction count will increment
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        ); //transactions array of struct datatype with all the info passed onto the function is pushed to the array
        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
        //public view means a read-only function
        //return transactions of the type-array defined by TransferStruct type
    }

    function getTransactionCount() public view returns (uint256) {
        //return transactionCount of the type uint256
        return transactionCount;
    }
}
