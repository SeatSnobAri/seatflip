let portFromCS;

function connected(p) {
    portFromCS = p;
    portFromCS.postMessage({greeting: "hi there content script!"});
    portFromCS.onMessage.addListener((cart) => {
        sendData(cart)
    });
}

browser.runtime.onConnect.addListener(connected);


function sendData(cart) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        const requestOptions = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(cart)
        }
        // console.log(host)
        fetch("https://192.168.1.200:80", requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                console.log(cart.uuid)
                intervalID = setInterval(myCallback, 1000, cart.uuid);
            })
            .catch(error => {
                console.log(error)
            })
    console.log(cart)
}

let intervalID


function myCallback(a) {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    let body = {
        key: a,
    }
    console.log(body)
    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    }
    fetch("https://192.168.1.200:81", requestOptions)
        .then(response => response.json())
        .then((data) => {
            if(data.error){
                console.log(data)
            }else if(!data.error){
                console.log("waiting")
            }
            if (data.data){
                portFromCS.postMessage({greeting: "they clicked the button!"});
                clearInterval(intervalID)
            }
        })
        .catch(error => {
            console.log(error)
        })
}