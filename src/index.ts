import { x402Client } from "@x402/core/client";
import { toClientEvmSigner } from "@x402/evm";
import { UptoEvmScheme } from "@x402/evm/upto/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { zeroGMainnet } from "viem/chains";

// Create signer
const signer = privateKeyToAccount(
	process.env.EVM_PRIVATE_KEY as `0x${string}`,
);

const publicClient = createPublicClient({
	chain: zeroGMainnet,
	transport: http(),
});

const evmSigner = toClientEvmSigner(signer, publicClient);

// Create x402 client and register EVM scheme
const client = new x402Client();
client.setSpendControls(false);
client.register("eip155:16661", new UptoEvmScheme(evmSigner));

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Make request - payment is handled automatically
const response = await fetchWithPayment(
	"http://localhost:8787/v1/chat/completions",
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "glm-5.3-flash",
			messages: [{ role: "user", content: "Hello!" }],
			stream: true,
		}),
	},
);

const data = await response.text();
console.log("Response:", data);
