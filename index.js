import express from 'express'
import * as thalos from '@eosswedenorg/thalos-client';

// Create client.
const thalos_client = thalos.createRedisClient({
    url: "redis://127.0.0.1:6379",
    prefix: "ship",
    ns: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4" // wax mainnet
})

thalos_client.onTransaction(transaction => {
    console.log("Transaction", transaction.id);
});

const app = express()

app.get('/get_transaction_traces/:id', async (req, res) => {
    res.json({ code: 404 })
});

app.listen(8000, () => {
    console.log('Thalos get_transaction_traces wrapper listening on port 8000!')
});

