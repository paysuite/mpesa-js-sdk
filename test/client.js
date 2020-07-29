import { Client } from '../src/client.js'
import chai from 'chai'
import sinon from 'sinon'

const expect = chai.expect;

const client = new Client({
    apiKey: '<REPLACE>',             // API Key
    publicKey: '<REPLACE>',          // Public Key
    serviceProviderCode: '<REPLACE>' // input_ServiceProviderCode
 });
 
const paymentDataReceive = {
   from: '850669801',                // input_CustomerMSISDN
   reference: '11114',               // input_ThirdPartyReference
   transation: 'T12344CC',           // input_TransactionReference
   amount: '10'                      // input_Amount
};

const paymentDataSend = {
    to: "850669801",                  // input_CustomerMSISDN
    reference: '11114',               // input_ThirdPartyReference
    transation: 'T12344CC',           // input_TransactionReference
    amount: '10'                      // input_Amount
};

describe("Receive Money from a Mobile Account", function(){
    it("Receive Money successful", function(){
        client.receive(paymentDataReceive).then(r => {
            expect(r.response.status).to.be.within(200, 201);
            done();
         }).catch(e =>{
             done(new Error("test case failed: " + e));
         });
    });
});

describe("Send Money to a Mobile Account", function(){
    it("Send Money successful", function(){
        client.send(paymentDataSend).then(r => {
            expect(r.response.status).to.be.within(200, 201);
            done();
         }).catch(e =>{
            done(new Error("test case failed: " + e));
         });
    });
});