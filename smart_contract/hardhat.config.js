// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.9",
// };

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://ropsten.infura.io/v3/229d52ef984c49ec9bb28d40ee0c8ee5',
      accounts: ['b833e4c630a9dcfd629d46b16631893e483e544da97604b10dbaa41a95fa9b66']
    }
  }
}