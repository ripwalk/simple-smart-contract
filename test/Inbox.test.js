const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require("web3")
const provider = ganache.provider()
const web3 = new Web3(provider)
const {interface, bytecode} = require('../compile')

let accounts;
let inbox;
const initialMessage = "Hi there!"
beforeEach(async()=>{
    // get list of all accounts
    accounts = await web3.eth.getAccounts()

    // use one of accounts to deploy the contracts
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
        data: bytecode,
        arguments: [initialMessage]
    })
    .send({
        from: accounts[0],
        gas: '1000000'
    })

    inbox.setProvider(provider)
})

describe('Inbox',()=>{
    it('deploys a contract',()=>{
        assert.ok(inbox.options.address)
    })
    it('has a default message',async () => {
        const message = await inbox.methods.message().call();
        // assert.equal(message,'Mi racle')
        assert.equal(message,initialMessage)
    })
    it('can change the message',async () => {
        await inbox.methods.setMessage('Bye!').send({
            from: accounts[0]
        })
        const message =  await inbox.methods.message().call();
        assert.equal(message,"Bye!")
    })
})