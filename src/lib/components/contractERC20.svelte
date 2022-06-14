<script>
    import ContractgetData from "./contractGetData.svelte"
    import ContractSetData from "./contractSetData.svelte"
    import ContractFactory from "./contractFactory.svelte"

    export let selector
    let contractERC20Address = null

    function selectedContract(event) {
        contractERC20Address = event.detail
        console.log("contractERC20Address", contractERC20Address)
        selector = selector
    }
</script>

{#if selector == 1}
    <div class="flex flex-col w-full">
        <div class="grid h-35 card bg-base-300 rounded-box place-items-center">
            <ContractFactory on:contractSelected={selectedContract} />
        </div>
        <div class="divider" />
    </div>
{/if}

{#if selector != 0}
    <div class="flex flex-col w-full lg:flex-row">
        <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
            {#if selector == 1 && contractERC20Address != null}
                <ContractgetData {contractERC20Address} />
            {:else if selector == 2 && contractERC20Address == null}
                <ContractgetData contractERC20Address="saga" />
            {/if}
        </div>
        <div class="divider lg:divider-horizontal">-</div>
        <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
            {#if selector == 1 && contractERC20Address != null}
                <ContractSetData {contractERC20Address} />
            {:else if selector == 2 && contractERC20Address == null}
                <ContractSetData contractERC20Address="saga" />
            {/if}
        </div>
    </div>
{/if}
