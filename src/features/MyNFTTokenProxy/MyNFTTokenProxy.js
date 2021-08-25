import MyNFTTokenProxyAbi from './MyNFTTokenProxyAbi';
import { Moralis } from "moralis";

const PROXY_TOKEN_ADDRESS = "0x16787Afc9F8100F2c8767905F308DcACC247Cbae"; // This is for the proxy
const TOKEN_ADDRESS = "0xc88A5728986445E2947E9d6B02a9f7C956D1a4E3"; // This is for the proxy

// This class represents the interface to the TreeToken contract
export class MyNFTTokenProxy {

    async init() {
        const web3 = await Moralis.Web3.enable();
        this.contract = new web3.eth.Contract(MyNFTTokenProxyAbi, PROXY_TOKEN_ADDRESS);
    }

    async name() {
        return this.contract.methods.name().call();
    }

    async symbol() {
        return this.contract.methods.symbol().call();
    }

    async upgrade(fromAddress) {
        return this.contract.methods.upgrade(TOKEN_ADDRESS)
            .send({ from: fromAddress });
    }
}
