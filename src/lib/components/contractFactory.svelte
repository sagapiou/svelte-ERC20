<script>
    import ethersStore from "../store/ethersStore.js"
    import { roundedBalanceEthFromWei, sliceAddress } from "../utils/various.js"
    import { connectToContract, connectSignerToContract } from "../utils/ethersContracts.js"
    import abiFact from "../../../constants/abiFact.json"
    import addressFact from "../../../constants/contractFact20Addresses.json"
    import { onMount } from "svelte"
    import { createEventDispatcher } from "svelte"

    $: metamaskConnected = window.ethereum ? window.ethereum.isConnected() : false
    $: slicedSigner = sliceAddress($ethersStore.signerAddress)
    $: walletConnected = $ethersStore.walletConnected
    $: balanceSigner = roundedBalanceEthFromWei($ethersStore.balance, 8)
    $: chainId = $ethersStore.selectedChainId

    let chainSupported = false
    let contractToLoad
    let errorUp = false
    let errorDescription = ""
    let ercNewName
    let ercNewSymbol
    let ercNewDecimals
    let sendTransactionNewContract
    let transactionReceipt
    let contractAddresses = []
    let selectedContract

    onMount(async () => {
        try {
            if (walletConnected == true) {
                await contractToLoadFunctions().catch((error) => {
                    errorUp = true
                    errorDescription = error
                })
                await getERCContracts().catch((error) => {
                    errorUp = true
                    errorDescription = error
                })
            }
        } catch (error) {
            console.log(error)
        }
    })

    const dispatch = createEventDispatcher()

    async function contractToLoadFunctions() {
        if (chainId == 3 || chainId == 4 || chainId == 31337) {
            chainSupported = true
            contractToLoad = await connectToContract(addressFact[chainId].toString(), abiFact)
            connectSignerToContract(contractToLoad)
        } else {
            chainSupported = false
            throw new Error(
                "Chain not supported. At the moment only Ropsen and Rinkeby are supported"
            )
        }
    }

    async function ercCreate() {
        sendTransactionNewContract = true
        let tx
        try {
            tx = await contractToLoad.deployNewERC20Token(ercNewName, ercNewSymbol, ercNewDecimals)
            transactionReceipt = await tx.wait()
            //console.log("transactionReceipt: ", transactionReceipt)
            sendTransactionNewContract = false
            await getERCContracts()
            //console.error("vgika trans")
        } catch (error) {
            errorUp = true
            errorDescription = `Contract Creation Failed : ${error.message}`
            sendTransactionNewContract = false
        }
    }

    async function getERCContracts() {
        try {
            contractAddresses = await contractToLoad.getDeployedERC20()
        } catch (error) {
            errorUp = true
            errorDescription = `Fetch contracts failed : ${error.message}`
        }
    }
</script>

{#if errorUp}
    <div class="alert alert-error shadow-lg w-96">
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                on:click={() => {
                    errorUp = false
                }}
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg
            >
            <span>{errorDescription}</span>
        </div>
    </div>
{/if}
{#if chainSupported}
    <table class=" flex-row w-full">
        <tr>
            <div class="h-1 m-1" />
        </tr>
        <tr>
            <td class="w-1/6 ">
                <div class=" align-middle">
                    <div class="form-control flex float-left">
                        <label class="input-group float-left align-middle">
                            <span>name</span>
                            <input
                                type="text"
                                placeholder="Token name"
                                class="input input-bordered"
                                bind:value={ercNewName}
                            />
                        </label>
                    </div>
                </div>
            </td>
            <td class="w-1/6">
                <div class=" align-middle">
                    <div class="form-control flex float-left">
                        <label class="input-group float-left align-middle">
                            <span>symbol</span>
                            <input
                                type="text"
                                placeholder="Token symbol"
                                class="input input-bordered"
                                bind:value={ercNewSymbol}
                            />
                        </label>
                    </div>
                </div>
            </td>
            <td class="w-1/6">
                <div class=" align-middle">
                    <div class="form-control flex float-left">
                        <label class="input-group float-left align-middle">
                            <span>decimals</span>
                            <input
                                type="text"
                                placeholder="decimals"
                                class="input input-bordered"
                                bind:value={ercNewDecimals}
                            />
                        </label>
                    </div>
                </div>
            </td>
            <td class="w-1/4  align-middle" />
            <td class="w-1/4  align-middle">
                <select
                    class="select select-primary w-full max-w-xs"
                    bind:value={selectedContract}
                    on:change={() => {
                        dispatch("contractSelected", selectedContract)
                    }}
                >
                    <option disabled selected>Which Contract to load?</option>
                    {#each contractAddresses as contractAddress}
                        <option value={contractAddress}>{contractAddress}</option>
                    {/each}
                </select>
            </td>
        </tr>
        <tr>
            <div class="h-1 m-1" />
        </tr>
        <tr>
            <td />
            <td class="  ">
                <div class="tooltip align-middle" data-tip="CREATE THE NEW ERC20 CONTRACT">
                    {#if sendTransactionNewContract}
                        <button class="btn loading btn-wide align-middle" disabled>Create</button>
                    {:else}
                        <button class="btn btn-wide align-middle" on:click={ercCreate}
                            >Create Contract</button
                        >
                    {/if}
                </div>
            </td>
            <td />
            <td />
        </tr>
        <tr>
            <div class="h-1 m-1" />
        </tr>
    </table>
{/if}
