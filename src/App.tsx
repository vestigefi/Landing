import Canvas from './components/Canvas';
import Card from './components/Card';

import vestige1 from './screenshots/vestige1.png';
import vestige2 from './screenshots/vestige2.png';
import vestige3 from './screenshots/vestige3.png';
import vaults1 from './screenshots/vaults1.png';
import vaults2 from './screenshots/vaults2.png';
import launchpad1 from './screenshots/launchpad1.png';
import launchpad2 from './screenshots/launchpad2.png';
import aggregator1 from './screenshots/aggregator1.png';
import chainui1 from './screenshots/chainui1.png';
import chainui2 from './screenshots/chainui2.png';
import tamequest1 from './screenshots/tamequest1.png';
import tamequest2 from './screenshots/tamequest2.png';
import tamequest3 from './screenshots/tamequest3.png';

function App() {
    return (
        <>
            <Canvas />
            <div className="text-white flex h-full w-full items-center justify-center">
                <div className="max-w-screen-xl text-center">
                    <div>
                        <p className="text-xl font-josefin">
                            <b className="italic font-bold">Vest Labs</b>
                            <span className="opacity-80">
                                {' '}
                                is a blockchain software development company focused on the practical applications of
                                the{' '}
                            </span>
                            <span className="font-medium">
                                <b>A</b>lgorand <b>V</b>irtual <b>M</b>achine
                            </span>
                            .
                        </p>
                        <p className="text-2xl pt-4 font-josefin">
                            If you can imagine it, <b className="font-bold">we can build it</b>.
                        </p>
                        <div className="py-8">
                            <a href="mailto:team@vestige.fi">
                                <button className="bg-white text-black hover:bg-opacity-80 px-4 py-2 rounded-lg text-lg transition-all">
                                    Contact us at <b>team@vestige.fi</b>
                                </button>
                            </a>
                        </div>
                    </div>
                    <div className="py-16">
                        <h1 className="font-bold text-4xl pb-8">Our products</h1>
                        <div className="gap-4 flex flex-wrap justify-center">
                            <Card
                                title="Vestige"
                                subtitle="DeFi Explorer for Algorand"
                                url="https://vestige.fi"
                                screenshots={[vestige1, vestige2, vestige3]}
                            />
                            <Card
                                title="Swap"
                                subtitle="DEX Aggregator"
                                url="https://vestige.fi/swap"
                                screenshots={[aggregator1]}
                            />
                            <Card
                                title="Vaults"
                                subtitle="Decentralized Token Lockups"
                                url="https://vestige.fi/vaults"
                                screenshots={[vaults1, vaults2]}
                            />
                            <Card
                                title="ChainUI"
                                subtitle="Decentralized Frontend Deployment Framework"
                                url="https://chainui.com"
                                screenshots={[chainui1, chainui2]}
                            />
                            <Card
                                title="Launchpads"
                                subtitle="Decentralized Token Launch Protocol"
                                url="https://vestige.fi/launchpad"
                                screenshots={[launchpad1, launchpad2]}
                            />
                            <Card
                                title="TameQuest"
                                subtitle="Decentralized VRF Pet Battler Game"
                                url="https://testnet.tamequest.com"
                                screenshots={[tamequest1, tamequest2, tamequest3]}
                            />
                            <Card
                                title="Dojex"
                                subtitle="Decentralized Margin Lending Protocol"
                                url="Coming soon..."
                                screenshots={[]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
