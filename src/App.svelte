<script>
    import "./app.css"
    import Footer from "../src/lib/components/Footer.svelte"
    import Header from "../src/lib/components/Header.svelte"
    import ethersStore from "./lib/store/ethersStore.js"
    import ConnectWallet from "./lib/components/connectWallet.svelte"
</script>

<div class="flex flex-col h-screen justify-between">
    <Header />

    <main class="mb-auto h-10 ">
        <div class="w-full ">
            <ConnectWallet />
        </div>
    </main>

    <Footer />
</div>
