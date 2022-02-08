//https://eth-ropsten.alchemyapi.io/v2/Ef--4elkbdCpjrnoqWxsrwhurppMJ5Pc

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/Ef--4elkbdCpjrnoqWxsrwhurppMJ5Pc',
      accounts: ['5adbed020dc72c8e3d5c373c72c3a22eb6e45fdddbdf58cc1aadb6a3cd256b83']
    }
  }
}