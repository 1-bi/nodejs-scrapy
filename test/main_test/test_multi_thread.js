const {  isMainThread, parentPort, workerData, threadId,
    MessageChannel, MessagePort, Worker } = require('worker_threads');


function mainThread() {
    let worker = new Worker(__filename, { workerData: 0 });
    worker.on('exit', code => {
        console.log(`main: worker stopped with exit code ${code}`); });

    worker.on('message', msg => {
        console.log(`main: receive ${msg}`);
        worker.postMessage(msg + 1);
    });
}

function workerThread() {
    console.log(`worker: threadId ${threadId} start with ${__filename}`);
    console.log(`worker: workerDate ${workerData}`);
    parentPort.on('message', msg => {
        console.log(`worker: receive ${msg}`);
        if (msg === 5) {
            process.exit();
        }
        setTimeout(function() {
            console.log(msg)
            parentPort.postMessage(msg);

        },5000)
    }),
    parentPort.postMessage(workerData);
}



if (isMainThread) {
    mainThread();
} else {
    console.log(56456)
    workerThread();
}

console.log("log end ================= ")