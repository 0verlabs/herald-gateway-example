import { x402Client } from "@x402/core/client";
import { UptoEvmScheme } from "@x402/evm/upto/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";

// Create signer
const signer = privateKeyToAccount(
	process.env.EVM_PRIVATE_KEY as `0x${string}`,
);

// Create x402 client and register EVM scheme
const client = new x402Client();
client.register("eip155:8453", new UptoEvmScheme(signer));

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Make request - payment is handled automatically
const response = await fetchWithPayment(
	"https://gateway.heraldprotocol.xyz/v1/chat/completions",
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
