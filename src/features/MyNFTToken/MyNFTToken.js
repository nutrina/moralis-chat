import MyNFTTokenAbi from './MyNFTTokenAbi';
import { Moralis } from "moralis";

const TOKEN_ADDRESS = "0x16787Afc9F8100F2c8767905F308DcACC247Cbae"; // This is for the proxy

// This class represents the interface to the TreeToken contract
export class MyNFTToken {

    async init() {
        const web3 = await Moralis.Web3.enable();
        this.contract = new web3.eth.Contract(MyNFTTokenAbi, TOKEN_ADDRESS);
    }

    async name() {
        return this.contract.methods.name().call();
    }

    async symbol() {
        return this.contract.methods.symbol().call();
    }

    async mint(fromAddress) {
        return this.contract.methods.mint()
            .send({ from: fromAddress });
    }

    async nextTokenId() {
        return this.contract.methods.nextTokenId()
            .call()
    }
}
