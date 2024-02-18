Small code that runs on top of Thalos client to create endpoint that implement a get_transaction_traces equivalent to that we have on hyperion

Whenever it receives a transaction it add it back into redis server with an expiry of 20 minutes.

This code is quick code, it aims to demonstrate the possibility of doing so, most of the time when doing bots on Antelope we need to get_transaction_traces from recent transactions but until Thalos there was no cheap way of having an API for this.