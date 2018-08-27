var safeMath = artifacts.require("./SafeMath.sol");
var library_mp = artifacts.require("./library_mp.sol");
var stores_mp = artifacts.require("./stores_mp");
var fronts_mp = artifacts.require("./fronts_mp");
var marketplace = artifacts.require("./marketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(safeMath);
  deployer.deploy(library_mp);

  deployer.link(library_mp, stores_mp);
  deployer.link(safeMath, stores_mp);
  deployer.deploy(stores_mp);

  deployer.link(library_mp, fronts_mp);
  deployer.link(safeMath, fronts_mp);
  deployer.deploy(fronts_mp);

  deployer.link(library_mp, marketplace);
  deployer.link(safeMath, marketplace);
  deployer.deploy(marketplace);
};