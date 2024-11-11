const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const isAuth = require('../middleware/is-auth');
/*
it('checking getHeader is Null', function(){
    //for testing req obj is defined by us.. here req obj is input. if(!authHeader) will be true onlt if it is null. so we define req obj with get will return null.
    const req = { 
        get: function(){
            return null;
        } 
    }
    //we should call where defined req obj is sent , res we're not dealing to empty obj is sent , for next call back is used which is also not used.
    //expect(isAuth(req, {}, () => {})).to.throw('not Authenticated');
    //above line we are calling isAuth function. Im want testing framework to call the function so we instead refernce of the function and used bind and bind should this as argument to say which reference is include.
    //even throw statement should be same as used in middle ware. 
    expect(isAuth.bind(this, req, {}, () => {})).to.throw('not Authenticated');
})*/

describe('isAuth middleware', function(){
    it('checking getHeader is Null', function(){
        const req = { 
            get: function(){
                return null;
            } 
        }
        expect(isAuth.bind(this, req, {}, () => {})).to.throw('not Authenticated');
    })

    it('should throw an error if SPLIT fails', function(){
        const req = { 
            get: function(){
                return 'xyz';
            } 
        }
        expect(isAuth.bind(this, req, {}, () => {})).to.throw('not Authenticated tapping token');
    })
/*//fails bcz it passes jwt.verify
    it('does req.userId is set?', function(){
        const req = { 
            get: function(){
                return 'bearer xyz';
            } 
        }
        //we execute middle with req obj so that we can check req.userId is set.
        isAuth(req, {}, ()=>{});
        expect(req).to.have.property('userId');
        //result so that we cant find jwt verify fails. 
    })
*/
    it('does req.userId is set?', function(){
        const req = { 
            get: function(){
                return 'bearer xyz';
            } 
        }
        //stud
        /*//manual stub -> replace all 
        jwt.verify = function(){
            return { userId : 'abc'}
        }//why returning obj with userId. because while jwt.sign we have passed userId in an object. when jwt verify success, it will return sent obj .
        isAuth(req, {}, ()=>{});
        expect(req).to.have.property('userId');
        //if it fails then req.userId is not set.
        */

        //sinon stub //it also register function call. can also check has function called , no matter what it executes
        sinon.stub(jwt, 'verify')
        jwt.verify.returns({ userId: 'abc'});
        isAuth(req, {}, ()=>{});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId');
        expect(jwt.verify.called).to.be.true; //check function is called in is-auth.js
        jwt.verify.restore(); //IMPORTANT

    })
/*
//same code but passes bcz of stud assigning jwt.verify globally 
     it('does req.userId is set?', function(){
        const req = { 
            get: function(){
                return 'bearer xyz';
            } 
        }
        //we execute middle with req obj so that we can check req.userId is set.
        isAuth(req, {}, ()=>{});
        expect(req).to.have.property('userId');
        //result so that we cant find jwt verify fails. 
    }) 
*/
})
