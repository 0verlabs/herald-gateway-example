# x402 client example

A minimal client that calls the Herald 0G PC Gateway and pays for the request with x402. No API key, no account. The wallet in your `.env` signs a USDC payment on Base (chain `eip155:8453`) whenever the server responds with HTTP 402, then the request retries automatically.

The whole thing is `client.ts`, about 30 lines.

## How it works

`wrapFetchWithPayment` wraps the standard `fetch`. When the gateway answers 402 with payment requirements, the wrapper asks the registered scheme (`UptoEvmScheme`, backed by your wallet via viem) to sign a payment, attaches it as a header, and resends the request. Your code only sees the final response.

## Setup

You need [Bun](https://bun.sh) and a wallet with USDC on Base.

```sh
bun install
cp .env.example .env
```

Put your wallet's private key in `.env`:

```
EVM_PRIVATE_KEY=0x...
```

This key signs real payments. Use a throwaway wallet with a small balance, and keep `.env` out of git (it already is, check `.gitignore` if you rename things).

## Run

```sh
bun run client.ts
```

The script sends a chat completion request to `https://gateway.heraldprotocol.xyz/v1/chat/completions` with the `glm-5.3-flash` model and prints the raw response body. Edit the model or messages in `client.ts` directly.

## Pointing it elsewhere

Any x402-enabled endpoint works. Change the URL in `client.ts`. If the endpoint settles on a different chain, register a scheme for that chain ID with `client.register(...)`.
