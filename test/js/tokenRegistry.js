const TokenRegistry = artifacts.require('./TokenRegistry.sol');
const assert = require('assert');
const expect = require('chai').expect;
const util = require('../../util/index.js')(web3);
const ethUtil = require('ethereumjs-util');

contract('TokenRegistry', accounts => {
  const owner = accounts[0];
  const notOwner = accounts[1];

  const token = {
    tokenAddress: `0x${ethUtil.setLength(ethUtil.toBuffer('0x1'), 20).toString('hex')}`,
    name: 'testToken',
    symbol: 'TT',
    url: 'www.test.com',
    decimals: 18,
    ipfsHash: `0x${util.sha3('test1').toString('hex')}`,
    swarmHash: `0x${util.sha3('test2').toString('hex')}`,
  };

  const nullToken = {
    tokenAddress: `0x${ethUtil.setLengthLeft(ethUtil.toBuffer('0x0'), 20).toString('hex')}`,
    name: '',
    symbol: '',
    url: '',
    decimals: 0,
    ipfsHash: `0x${ethUtil.setLengthLeft(ethUtil.toBuffer('0x0'), 32).toString('hex')}`,
    swarmHash: `0x${ethUtil.setLengthLeft(ethUtil.toBuffer('0x0'), 32).toString('hex')}`,
  };

  let tokenRegUtil;

  before(done => {
    TokenRegistry.deployed().then(instance => {
      tokenRegUtil = util.tokenRegUtil(instance);
      done();
    });
  });

  describe('addToken', () => {
    it('should throw when not called by owner', done => {
      tokenRegUtil.addToken(token, { from: notOwner }).catch(e => {
        assert(e);
        done();
      });
    });

    it('should add token metadata when called by owner', done => {
      tokenRegUtil.addToken(token, { from: owner }).then(() => {
        tokenRegUtil.getTokenMetaData(token.tokenAddress).then(tokenData => {
          expect(tokenData).to.deep.equal(token);
          done();
        });
      });
    });
  });

  describe('removeToken', () => {
    it('should throw if not called by owner', done => {
      tokenRegUtil.removeToken(token.tokenAddress, { from: notOwner }).catch(e => {
        assert(e);
        done();
      });
    });

    it('should remove token metadata when called by owner', done => {
      tokenRegUtil.removeToken(token.tokenAddress, { from: owner }).then(res => {
        assert(res.logs.length === 1);
        tokenRegUtil.getTokenMetaData(token.tokenAddress).then(tokenData => {
          expect(tokenData).to.deep.equal(nullToken);
          done();
        });
      });
    });
  });

  describe('setTokenName', () => {

  });

  describe('setTokenSymbol', () => {

  });

  describe('getTokenMetaData', () => {

  });

  describe('getTokenBySymbol', () => {

  });
});
