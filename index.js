import express from 'express'
import * as thalos from '@eosswedenorg/thalos-client';
import { createClient } from 'redis';


const main = async() => {
    // Create client.
    const thalos_client = thalos.createRedisClient({
        url: "redis://127.0.0.1:6379",
        prefix: "ship",
        ns: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4" // wax mainnet
    })

    const redis_client = await createClient({
        url: "redis://127.0.0.1:6379"
    });
    await redis_client.connect()

    thalos_client.onTransaction(async (transaction) => {
        const key = 'thalos_transaction_'+transaction.id;
        const transaction_stringify = JSON.stringify(transaction)
        try {
            await redis_client.set(key, transaction_stringify, {
                'EX': 1200 // 20 minutes expiry
            });
        }
        catch(e) {
            console.log('Error adding key value to redis');
            console.error(e);
        }
    });

    const app = express()
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.get('/get_transaction_traces/:txid', async (req, res) => {
        const key = 'thalos_transaction_'+req.params.txid;
        try {
            const transaction_stringify = await redis_client.get(key)

            if(!transaction_stringify) {
                res.json({code: 404, message: 'Transaction not found'})
                return;
            }

            const transaction = JSON.parse(transaction_stringify)
            res.json(transaction)
        }
        catch(e) {
            res.json({code: 500, message: 'Error while getting transaction'})
        }
    });

    app.listen(8000, () => {
        console.log('Thalos get_transaction_traces wrapper listening on port 8000!')
    });
}


main();