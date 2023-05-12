document.body.style.border = "5px solid red";
function getData(){
    const checkElement = async selector => {
        while ( document.querySelector(selector) === null) {
            await new Promise( resolve =>  requestAnimationFrame(resolve) )
        }
        return document.querySelector(selector);
    };

    const b =  document.querySelector('[aria-label="Toggle Order Summary"]')
    b.click()

    const mobile = checkElement('[data-tid="delivery-method"]').then((selector)=>{
        console.log(selector.innerText)
        const lower = selector.innerText.toLowerCase()


        if (lower.includes("mobile")){
            console.log("yes")
            // I'm checking for a specific class button is open for summary and then running code.
            const el6 =  checkElement('[data-tid="summary-quantity-type"]').then((selector) => {

                console.log(selector)

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
                    ticket_price: selector.textContent,
                    ticket_total: el7.innerText.replace(/\r\n|\n|\r/gm," "),
                    buy: false,
                }
                console.log(cart)
                sendData(cart)
            })
        }else{
            console.log("no")
        }
        return selector
    })
    console.log(mobile)
    const place = document.querySelector('[data-tid="place-order-btn"]')
    place.disabled=true;
    place.style.background='red'
    return
}
let intervalID
function sendData(cart){
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(cart)
    }
    fetch(`http://localhost:8082`, requestOptions)
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
    fetch(`http://localhost:1234/va-buy`, requestOptions)
        .then(response => response.json())
        .then((data) => {
            if(data.error){
                console.log(data)
                clearInterval(intervalID)
                return
            }
            console.log(data)
            if (data.data){
                const place = document.querySelector('[data-tid="place-order-btn"]')
                place.disabled=false;
                place.style.background='green'
                clearInterval(intervalID)
            }
            // if(data.error){
            //     alert("something wrong")
            // }
        })
        .catch(error => {
            console.log(error)
        })
    console.log(a);
}
getData()