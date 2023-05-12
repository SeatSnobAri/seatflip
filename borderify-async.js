document.body.style.border = "5px solid red";
const host = "99.29.228.57"
async function CheckElement(selector) {
    while ( document.querySelector(selector) === null) {
        await new Promise( resolve =>  requestAnimationFrame(resolve) )
    }
    return document.querySelector(selector);
}

async function getData(){
    console.log('I am getting called')

    const place = await CheckElement('[data-tid="place-order-btn"]')
    place.disabled=true;
    place.style.background='red'

    const mobile = await CheckElement('[data-tid="delivery-method"]');
    // Create your observer
    const observer = new MutationObserver(function(mutationList, observer) {
        // Your handling code
        console.log("changed")
    });

// Select the element you want to watch
    const elementNode = mobile

// Call the observe function by passing the node you want to watch with configuration options
    observer.observe(elementNode, {
        attributes: false,
        childList: true,
        subtree: false }
    );

// When ready to diconnect
    observer.disconnect();

    const b =  document.querySelector('[aria-label="Toggle Order Summary"]')
    b.click()

    console.log(mobile.innerText)
    const lower = mobile.innerText.toLowerCase()


    if (lower.includes("mobile")){
        console.log("yes")
        // I'm checking for a specific class button is open for summary and then running code.
        const el6 = await CheckElement('[data-tid="summary-quantity-type"]')


        const el1 = document.querySelector('[data-tid="event-name"]');

        const el2 = document.querySelector('[data-tid="event-datetime"]');
        const event_date = el2.innerHTML.replace(/(<([^>]+)>)/gi, "");

        const el3 = document.querySelector('[data-tid="event-venue"]');

        const el4 = document.querySelector('[data-tid="ticket-info"]');

        const el5 = document.querySelector('[data-tid="seat-info"]');
        const seat_info = el5.innerHTML.replace(/(<([^>]+)>)/gi, "");

        const el7 = document.querySelector('[data-tid="header-button"]');


        const id = window.location.pathname

        let cart = {
            uuid: id,
            event_name: el1.innerHTML,
            event_date: event_date,
            event_venue: el3.innerHTML,
            ticket_info: el4.innerHTML,
            seat_info: seat_info,
            ticket_price: el6.textContent,
            ticket_total: el7.innerText.replace(/\r\n|\n|\r/gm," "),
            buy: false,
        }
        console.log(cart)
        sendData(cart)
    }else{
        console.log("no")
    }

}

// new Promise(getData());
getData().then().catch(reason=>{console.log('sorry daddy')});

let intervalID
function sendData(cart){
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(cart)
    }
    // console.log(host)
    fetch(`http://99.29.228.57:8082`, requestOptions)
        .then(response => response.json())
        .then((data) => {
          console.log(data)
            intervalID = setInterval(myCallback, 1000, window.location.pathname);
        })
        .catch(error => {
            console.log(error)
        })
}


function myCallback(a) {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    let body = {
        key: a,
    }
    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    }
    fetch(`http://99.29.228.57:1234/va-buy`, requestOptions)
        .then(response => response.json())
        .then((data) => {
            if(data.error){
                console.log(data)
                clearInterval(intervalID)
                return
            }else if(!data.error){
                console.log("waiting")
            }
            if (data.data){
                const place = document.querySelector('[data-tid="place-order-btn"]')
                place.disabled=false;
                place.style.background='green'
                clearInterval(intervalID)
            }
        })
        .catch(error => {
            console.log(error)
        })
}
