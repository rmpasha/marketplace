module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      //gas: 10000000,
      //gasPrice: 20000000000,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "https://ropsten.infura.io/v3/950c69149fc54d54b42a91fed947fcb4",
      network_id: "3",
      gas: 200000,
    },
    integration: {
      host: 'localhost',
      port: 8545,
      network_id: 'integration',
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,         // <-- Use port 8555
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    }
  }
};
/*
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.INFURA_ROPSTEN_MNEMONIC, "https://ropsten.infura.io/v3/"+process.env.INFURA_KEY)
      },
      network_id: "3",
      gas: 10000000
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(process.env.INFURA_MAINNET_MNEMONIC, "https://rinkeby.infura.io/v3/"+process.env.INFURA_KEY)
      },
      network_id: "4",
      gas: 10000000
    },
    main: {
      provider: function() {
        return new HDWalletProvider(process.env.INFURA_MAINNET_MNEMONIC, "https://mainnet.infura.io/"+process.env.INFURA_KEY)
      },
      network_id: "1",
      gas: 10000000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
*/

