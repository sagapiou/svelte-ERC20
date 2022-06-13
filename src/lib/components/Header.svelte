<script>
    import { onMount } from "svelte"
    import connectWallet from "../utils/connectWallet.js"
    import ethersStore from "../store/ethersStore.js"
    import { ethers } from "ethers"
    import { sliceAddress, roundedBalanceEthFromWei } from "../utils/various.js"

    onMount(async () => {
        await connectWallet()
    })

    //     function copyAddress() {
    //     navigator.clipboard.writeText($selectedAccount)
    // }
    $: metamaskConnected = window.ethereum ? window.ethereum.isConnected() : false
    $: slicedSigner = sliceAddress($ethersStore.signerAddress)
    $: balanceSigner = roundedBalanceEthFromWei($ethersStore.balance, 8)
    //  $: balance = $connected && $selectedAccount ? $web3.eth.getBalance($selectedAccount) : ""
</script>

<header class="h-10">
    <div class="navbar bg-base-100 border-y-4">
        <div class="flex-1">
            <button class="btn btn-square btn-ghost">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="inline-block w-5 h-5 stroke-current"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    /></svg
                >
            </button>
        </div>
        <div class="flex-none">
            <div class="stats shadow" />
            <div class="flex-none normal-case text-xl font-bold " />
            {#if $ethersStore.walletConnected == true}
                <div class="stats shadow">
                    <div class="flex-none">
                        <div class="stat">
                            <div class="stat-title">BALANCE</div>
                            <div class="stat-value">{balanceSigner}</div>
                            <!-- <div class="stat-actions">
                                <button class="btn btn-sm btn-success">Add funds</button>
                            </div> -->
                        </div>
                    </div>
                    <div class="flex-none">
                        <div class="stat">
                            <div class="stat-title">ADDRESS</div>
                            <div class="stat-value">{slicedSigner}</div>
                            <!-- <div class="stat-actions">
                                <button class="btn btn-sm btn-failure">Disconnect</button>
                            </div> -->
                        </div>
                    </div>
                    {#if metamaskConnected == true}
                        <div class="flex-none">
                            <div class="stat">
                                <div class="stat-figure text-secondary">
                                    <div class="avatar online">
                                        <div class="w-16 rounded-full">
                                            <img src="connection.jpg" alt="Connected" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="stats shadow flex-none">
                    <div class="flex-none">
                        <div class="stat">
                            <div class="stat-figure text-secondary">
                                <div class="avatar online">
                                    <div class="w-12 rounded-full">
                                        <img src="noConnection.jpg" alt="Disconnected" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
            <div />
        </div>
    </div>
</header>
