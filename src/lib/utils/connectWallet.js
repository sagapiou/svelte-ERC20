import ethersStore from "../store/ethersStore.js"
import { get } from "svelte/store"
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min.js"

async function connectModal() {
    try {
        console.log("In connect Modal")
        const web3Modal = await getWeb3Modal()
        const provider = await web3Modal.connect()
        return provider
    } catch (err) {
        console.log("error:", err)
    }
}

async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
        cacheProvider: false,
        theme: "dark",
        providerOptions: {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: import.meta.env.VITE_INFURA_API_KEY,
                },
            },
        },
    })
    return web3Modal
}

// get the global objects
const globalObj = () => {
    if (typeof window !== "undefined") {
        return window
    }
    if (typeof global !== "undefined") {
        return global
    }
    if (typeof globalThis !== "undefined") {
        return globalThis
    }
    if (typeof self !== "undefined") {
        return self
    }
    throw new Error("there is no global object")
}

//check if ethereum is connected to the global object
function windowEthereum() {
    try {
        if (globalObj().ethereum) {
            return globalObj().ethereum
        }
    } catch (err) {
        console.error("no global ethereum detected")
        return null
    }
}

export default async function connectWallet() {
    try {
        let provider = null
        let accounts = null
        let signer = null
        let signerAddress = ""
        let balance = BigInt(0)
        let network, chainId, name
        if (windowEthereum()) {
            //will try to connect to Metamask
            // will update the store with all three below values
            //provider = new ethers.providers.Web3Provider(window["ethereum"])
            console.log("In connect Modal")
            const web3Modal = await getWeb3Modal()
            const instance = await web3Modal.connect()
            provider = new ethers.providers.Web3Provider(instance)
            accounts = await provider.send("eth_requestAccounts", [])
            signer = provider.getSigner()
            signerAddress = await signer.getAddress()
            balance = (await signer.getBalance()).toBigInt()

            // start the listeners for listening to change of network, and accounts
            startMetamaskListeners()
        } else {
            // no global ethereum object
            // will update the store with provide as default provider
            console.log("no eip1559 wallet")
            console.log("will try to connect to the default provider")
            provider = get(ethersStore).defaultProvider
        }
        network = await provider.getNetwork()
        chainId = network.chainId
        name = network.name

        // update the store with all values
        ethersStore.newProvider(provider, signer, signerAddress, name, chainId, balance)
        //console.log("ethersStore", get(ethersStore))
    } catch (error) {
        console.log(error)
    }
}

function startMetamaskListeners() {
    window["ethereum"].on("accountsChanged", updateSelectedAddress)
    window["ethereum"].on("chainChanged", updateNetwork)
    window["ethereum"].on("message ", metamaskMessage)
}

function stopMetaMaskListeners() {
    window["ethereum"].removeListener("accountsChanged", updateSelectedAddress)
    window["ethereum"].removeListener("chainChanged", updateNetwork)
    window["ethereum"].removeListener("message", metamaskMessage)
}

//listener for account changes
const updateSelectedAddress = async (accounts) => {
    // console.log("change account listener")
    if (accounts.length) {
        // console.log("change account")
        // update signer and signer address
        const signer = get(ethersStore).provider.getSigner()
        const signerAddress = await signer.getAddress()
        const balance = await signer.getBalance()
        ethersStore.changeAccount(signer, signerAddress, balance)
    } else {
        //console.log("reset connection")
        // reset connection and stop metamask listeners
        stopMetaMaskListeners()
        ethersStore.resetConnection()
        // console.log("ethersStore", get(ethersStore))
    }
}

//listener for network change
const updateNetwork = async (chainId) => {
    // console.log("changes blockchain listener")
    stopMetaMaskListeners()
    await connectWallet()
    // console.log("ethersStore", get(ethersStore))
}

//listener for metamask connectio
const metamaskMessage = async (ProviderMessage) => {
    console.log("metamask message listener")
    console.log(ProviderMessage.type)
    console.log("ethersStore", get(ethersStore))
}

// const sendTransactionRinkeby = async () => {
//     const { name, chainId } = await $provider.getNetwork()
//     //console.log("name", name, "chainId", chainId)
//     if (chainId !== 4) {
//         console.log("wrong network")
//         return
//     }
//     const balance = await $signer.getBalance()
//     //console.log("balance", balance)
//     //0x9f02C6eAA3ff92828Cc4A5b93a38c2DCEd0774bC
//     $signer.sendTransaction({
//         to: "0x9f02c6eaa3ff92828cc4a5b93a38c2dced0774bc",
//         value: ethers.utils.parseEther("0.01"),
//     })
//     getBalance()
// }
