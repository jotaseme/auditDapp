import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  transactions;
  userAddress;
  balance: Token[] = [];
  selectedChain = initialChain;

  chains = [
    {
      'hex':'0x38',
      'enum':'bsc',
      'name': 'BSC - Binance Smart Chain',
      'token': 'BNB',
      'scan': 'https://bscscan.com/tx/'
    },
    {
      'hex':'0x89',
      'enum':'polygon',
      'name': 'Polygon Chain',
      'token': 'MATIC',
      'scan': 'https://polygonscan.com/tx/'
    },
  ]
  constructor() { }

  async ngOnInit() {
    this.userAddress = await Moralis.User.current().get('ethAddress');
    console.log(this.userAddress);
    const web3 = await Moralis.Web3.enable();
    this.selectedChain = this.chains.find((res) => res.hex === web3.currentProvider['chainId']);
    //this.getCurrentPrice(null);
    await this.getTransactions();
    Moralis.Web3.onChainChanged(async (account) => {
      window.location.reload();
    });
    this.getBalances();
  }

  private async getTransactions() {
    await Moralis.Web3API.account.getTransactions(
      {
        chain: this.selectedChain.enum == 'bsc' ? 'bsc' : 'polygon',
        address: this.userAddress
      }
    ).then((res) => {
      console.log(res)
      this.transactions = res.result
    });
  }

  private async getBalances() {
    console.log(this.userAddress)
    await Moralis.Web3.getAllERC20(
      {
        chain: this.selectedChain.enum == 'bsc' ? 'bsc' : 'polygon',
        address: this.userAddress
      }
    ).then((res) => {
      console.log(res)
      // @ts-ignore
      this.balance = res;
    });
  }

  async getCurrentPrice(token: Token) {
      if(token.symbol != 'BNB') {

        const price = await Moralis.Web3API.token.getTokenPrice({address: token.tokenAddress,  chain: "bsc",  exchange: "PancakeSwapv2"});
        console.log(price);
      }
    //const price1 = await Moralis.Cloud.run('getPrice', {address: "0x72eb7ca07399ec402c5b7aa6a65752b6a1dc0c27"});

  }
}

export interface Token {
  tokenAddress: string;
  balance: string;
  name: string;
  symbol: string;
}

export interface Chain {
  hex: string;
  enum: string;
  name: string;
  token: string;
  scan: string;
}

export const initialChain: Chain = {
  hex: '',
  enum: '',
  name: '',
  token: '',
  scan: '',
};
