<script>
    import ContractgetData from "./contractGetData.svelte"
    import ContractSetData from "./contractSetData.svelte"
    import ContractFactory from "./contractFactory.svelte"
    import ethersStore from "../store/ethersStore.js"

    export let selector

    $: contractERC20Address =
        $ethersStore.contract == null || $ethersStore.contract == "" ? "" : $ethersStore.contract
    $: changedContract = $ethersStore.changedContract ? $ethersStore.changedContract : false
    // $: console.log("contractERC20Address", contractERC20Address)
    // $: console.log("ethersStore", $ethersStore.changedContract)
    // $: console.log("changedContract", changedContract)

    // function selectedContract(event) {
    //     contractERC20Address = event.detail
    //     console.log("contractERC20Address", contractERC20Address)
    //     selector = selector
    // }
</script>

{#if selector == 1}
    <div class="flex flex-col w-full">
        <div class="grid h-35 card bg-base-300 rounded-box place-items-center">
            <!-- <ContractFactory on:contractSelected={selectedContract} /> -->
            <ContractFactory />
        </div>
        <div class="divider" />
    </div>
{/if}

{#if selector != 0}
    <div class="flex flex-col w-full lg:flex-row">
        <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
            {#if selector == 1 && contractERC20Address != ""}
                {#if changedContract}
                    <ContractgetData contractERC20="" />
                {:else}
                    <ContractgetData contractERC20="" />
                {/if}
            {:else if selector == 2}
                <ContractgetData contractERC20="saga" />
            {/if}
        </div>
        <div class="divider lg:divider-horizontal">-</div>
        <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
            {#if selector == 1 && contractERC20Address != ""}
                {#if changedContract}
                    <ContractSetData contractERC20="" />
                {:else}
                    <ContractSetData contractERC20="" />
                {/if}
            {:else if selector == 2}
                <ContractSetData contractERC20="saga" />
            {/if}
        </div>
    </div>
{/if}
