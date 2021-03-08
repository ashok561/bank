# bank
1) Create a new bank account for a customer, with an initial deposit amount. 
http://127.0.0.1:5000/api/v1/auth/register
result: {
    "name":"naveen",
    "account_no":"SBI_004",
    "password":"password@123",
    "amount":"4000"
}
2) A single customer may have multiple bank accounts.
  http://127.0.0.1:5000/api/v1/auth/register
result: {
    "name":"naveen",
    "account_no":"SBI_004",
    "password":"password@123",
    "amount":"4000"
}

3) Transfer amounts between any two accounts, including those owned by different customers.
http://127.0.0.1:5000/api/v1/transaction
result: {
    "receiver_account_no":"SBI_004",
    "amount":"200"
}

4) Retrieve balances for a given account.
http://127.0.0.1:5000/api/v1/auth/SBI_001
result: {
    "success": true,
    "data": {
        "role": "user",
        "_id": "604644776e1da02220041fb1",
        "name": "ashok",
        "account_no": "SBI_001",
        "amount": 3400,
        "createdAt": "2021-03-08T15:36:23.830Z",
        "__v": 0
    }
}

5) Retrieve transfer history for a given account.
http://127.0.0.1:5000/api/v1/transaction/history/SBI_002
result:{
    "success": true,
    "data": [
        {
            "_id": "604644eb6e1da02220041fb8",
            "receiver_account_no": "SBI_004",
            "amount": "200",
            "user": "6046447f6e1da02220041fb2",
            "sender_account_no": "SBI_002",
            "created_at": "2021-03-08T15:38:19.138Z",
            "__v": 0
        }
    ]
}
