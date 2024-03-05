/*
 * File: Main controller for Property Delphi
 * Author: @thewoodfish
 * Date-Time: Fri 16 Feb 1:39 am
 */

function qs(tag) {
    return document.querySelector(tag);
}

function qsa(tag) {
    return document.querySelectorAll(tag);
}

function ce(tag) {
    return document.createElement(tag);
}

function clearField(attr) {
    qs(attr).value = "";
}

function getFirstName(name) {
    return name.split(" ")[0];
}

function appear(attr) {
    qs(attr).classList.remove("hidden");
}

function hide(attr) {
    if (!qs(attr).classList.contains("hidden"))
        qs(attr).classList.add("hidden");
}

function generateRandomNumber() {
    let min = 500;
    let max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertTimestamp(timestamp) {
    // Create a new date object from the timestamp
    var date = new Date(timestamp * 1000);

    // Get the day of the week
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayOfWeek = daysOfWeek[date.getUTCDay()];

    // Get the month and day of month
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[date.getUTCMonth()];
    var dayOfMonth = date.getUTCDate();

    // Get the hours, minutes, and format for AM/PM
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes().toString().padStart(2, '0');
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12 || 12).toString().padStart(2, '0');

    // Return the nicely formatted date time string
    return `${dayOfWeek} ${hours}:${minutes}${ampm}, ${dayOfMonth}${getOrdinalIndicator(dayOfMonth)} of ${month}, ${date.getUTCFullYear()}`;
}

function convertTimestampString(timestampString) {
    // Parse the timestamp string
    const [dateString, timeString] = timestampString.split(', ');
    const [month, day, year] = dateString.split('/');
    let [time, meridian] = timeString.split(' ');

    let [hour, minute, second] = time.split(':');
    hour = parseInt(hour);
    if (hour > 12) {
        meridian = "PM";
    } else {
        meridian = "AM";
    }

    // 05/03/2024, 19:02:43

    // Create a new date object from the parsed components
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

    // Get the day of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getUTCDay()];

    // Get the month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthString = months[date.getUTCMonth()];

    // Get the day of month
    const dayOfMonth = date.getUTCDate();

    // Get the hours, minutes
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Return the nicely formatted date time string
    return `${dayOfWeek} ${hours}:${minutes}${meridian}, ${dayOfMonth}${getOrdinalIndicator(dayOfMonth)} of ${monthString}, ${date.getUTCFullYear()}`;
}

// Function to get the ordinal indicator (st, nd, rd, th)
function getOrdinalIndicator(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function isValidSS58Addr(input) {
    // Regular expression for a valid SS58 address (excluding version byte)
    const regex = /^[a-km-zA-HJ-NP-Z1-9]{44,47}$/;

    // Check if the input string is present and has the correct length
    if (!input || input.length < 45 || input.length > 48) {
        return false;
    }

    // Extract the address without the version byte (first character)
    const address = input.slice(1);

    // Validate the address using the regular expression
    return regex.test(address);
}

// Function to get the ordinal indicator (e.g. st, nd, rd, th) for a number
function getOrdinalIndicator(num) {
    if (num > 3 && num < 21) return 'th';
    switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// check if server & chain is connected 
function is_connected() {
    if (qs(".chain-connected").classList.contains("hidden")) {
        toast("Please check connection to server or chain");
        return false;
    }
    return true;
}

async function heartbeat() {
    // check if the property chain is still on and running
    fetch("/heartbeat", {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async res => {
            await res.json().then(res => {
                if (!is_connected()) {
                    toast("✅ connection repaired");
                    // automatically renew session
                    (async function () {
                        await queryServerToSignIn(getSessionNonce(), false);
                    })();
                }
                hide(".chain-connecting");
                appear(".chain-connected");
            });
            ;
        })
        .catch(error => {
            hide(".chain-connected");
            appear(".chain-connecting");
            toast("❌ connection to server or chain broken");
        });
}

async function queryServerToSignIn(seed, rollup, on_connect = false) {
    // send request to chain
    if (!is_connected() && !on_connect) return;
    fetch("/sign-in", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "keys": seed    // can be seed or nonce
        })
    })
        .then(async res => {
            await res.json().then(res => {
                if (!res.error) {
                    clearField(".seed-phrase-ta");
                    setSessionNonce(res.data.nonce);
                    updateAuthUser(res.data.ss58_addr, res.data.name);
                    hide(".sign-in-btn-after");
                    appear(".sign-in-btn-before");
                    toast(`Hey <code>${getFirstName(res.data.name)}</code>, Welcome to <code>Property Delphi</code>`);

                    // roll up the card
                    if (rollup) click(".sign-in-prompt");
                } else {
                    toast("❌ Could not sign you in. Please check your seed.");
                    hide(".sign-in-btn-after");
                    appear(".sign-in-btn-before");
                }
            });

        })
}

// check if a user has been authenticated successfully
function userIsAuth() {
    if (qs(".signed-in-user-did").innerText.indexOf("xxxxx") == -1) return true;
    else {
        toast("❌ You need to be authenticated to perform this action");
        return false;
    }
}

function toast(msg) {
    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);
    qs('.toast-body').innerHTML = msg;
    toast.show();
}

function incConnectionCount() {
    let cc = qs(".connection-count");
    cc.innerText = cc.innerText ? parseInt(cc.innerText) + 1 : 1;
}

function truncate(str, end) {
    return str.substr(0, end);
}

function updateAuthUser(did, name) {
    qs(".signed-in-user-name").innerText = name.length > 20 ? `${truncate(name, 17)}...` : name;
    qs(".signed-in-user-did").innerText = did.length > 30 ? `${truncate(did, 27)}...` : did;
}

function setSessionNonce(value) {
    sessionStorage.setItem("session_nonce", value);
}

function getSessionNonce(value) {
    return sessionStorage.getItem("session_nonce");
}

// initialize connection to Chain
async function initChainConnection(addr) {
    const result = await new Promise((resolve) => {
        // contact the server to initialize connection
        fetch("/connect-chains", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "addr": addr,
            })
        })
            .then(async res => {
                await res.json().then(async res => {
                    // start the heartbeat
                    setInterval(() => {
                        heartbeat();
                    }, 30000);

                    // if nonce is still present, sign user in automatically
                    if (getSessionNonce()) {
                        await queryServerToSignIn(getSessionNonce(), false, true);
                    }

                    resolve(res.status);
                });
            })
    });

    console.log(result);
    return result;
}

function click(attr) {
    qs(attr).click();
}

function clearPropertyAttributes() {
    const container = qs(".attr-display");
    if (container) {
        // Use a traditional loop for clarity and potential performance benefits:
        for (let i = container.children.length - 1; i > 1; i--) {
            container.removeChild(container.children[i]);
        }

        // reduce the property buffers to their initial state
        ptype_buffer = ["Address of property", "Size of property"];
        pseudo_buffer = ["address of property", "size of property"];
    } else {
        console.warn("Container with class 'attr-display' not found.");
    }
}


// to prevent duplicate additiom of values
let ptype_buffer = ["Address of property", "Size of property"];
let pseudo_buffer = ["address of property", "size of property"];

// intialize connection to chain

toast(`waiting to connect to the <code>contracts node</code>.`);
(async function () {
    if (await initChainConnection('ws://127.0.0.1:9944') == "connected") {
        // update UI
        incConnectionCount();
        hide(".chain-connecting");
        appear(".chain-connected");
        toast("✅ Connection to <code>contracts node</code>  established.")
        incConnectionCount();
    };
})();

document.body.addEventListener(
    "click",
    (e) => {
        e = e.target;
        // ensure connection is established for both required chains
        if (qs(".connection-count").innerText == `2`) {
            if (e.classList.contains("add-attr")) {
                // add new attribute
                let field_val = qs(".attr-field").value;
                let code = generateRandomNumber();
                if (field_val) {
                    if (!pseudo_buffer.includes(field_val.toLowerCase())) {
                        let attr_display = qs(".attr-display");
                        attr_display.innerHTML += `<p class="xy-${code}"><code><span class="xx-${code} minus blue pointer">-</span> 
                            <span class="zz-${code}">${field_val}</span></code></p>`;
                        clearField(".attr-field");
                        ptype_buffer.push(field_val);
                        pseudo_buffer.push(field_val.toLowerCase());
                    } else
                        toast(`❌ "${field_val}" has been added already`);
                }
            } else if (e.classList.contains("minus")) {
                // delete specified attribute
                let attrElement = qs(`.xy-${e.classList[0].split('-')[1]}`);
                let innerText = qs(`.zz-${e.classList[0].split('-')[1]}`).innerText;

                for (var i = 0; i < ptype_buffer.length; i++) {
                    if (ptype_buffer[i] == innerText) {
                        ptype_buffer.splice(i, 1);
                        pseudo_buffer.splice(i, 1);
                    }
                };

                attrElement.parentElement.removeChild(attrElement);
            } else if (e.classList.contains("reg-property-before")) {
                if (!is_connected()) return;

                let title = qs(".doc-title-field").value;
                if (!qs(".doc-title-field").value) {
                    toast(`❌ Please specify the title of the document.`)
                    return;
                }

                if (ptype_buffer.length > 2) {
                    if (userIsAuth()) {
                        hide(".reg-property-before");
                        appear(".reg-property-after");

                        // send request to chain
                        fetch("/register-ptype", {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "attributes": ptype_buffer.join(`~`),
                                title,
                                "nonce": getSessionNonce()
                            })
                        })
                            .then(async res => {
                                await res.json().then(res => {
                                    hide(".reg-property-after");
                                    appear(".reg-property-before");

                                    if (!res.error) {
                                        appear(".ptype-reg-success");
                                        clearField(".doc-title-field");
                                        setTimeout(() => hide(".ptype-reg-success"), 5000);
                                        clearPropertyAttributes();
                                    } else {
                                        appear(".ptype-reg-error");
                                        setTimeout(() => hide(".ptype-reg-error"), 5000);
                                    }
                                });
                                ;
                            })
                    }
                } else {
                    toast(`❌ You need to specify more attributes.`);
                }
            } else if (e.classList.contains("load-properties-btn-before")) {
                if (!is_connected()) return;

                const authAddr = qs(".authority-ss58-addr").value;
                if (isValidSS58Addr(authAddr)) {
                    hide(".load-properties-btn-before");
                    appear(".load-properties-btn-after");

                    // send request to chain
                    fetch("/fetch-ptypes", {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "address": authAddr,
                            "nonce": getSessionNonce()
                        })
                    })
                        .then(async res => {
                            await res.json().then(res => {
                                hide(".load-properties-btn-after");
                                appear(".load-properties-btn-before");

                                if (!res.error) {
                                    appear(".document-selection-div");

                                    // populate UI
                                    let select = qs(".document-type-selector");
                                    select.innerHTML = `<option class="select-option" value="zero">Select the right document from this menu</option>`;
                                    [].forEach.call(res.data, (p) => {
                                        console.log(p);
                                        select.innerHTML += `<option value="${p.slug}" class="select-option" data-props="${p.attributes.join("$$$")}">${p.name}</option>`;
                                    });
                                }
                            });
                        })
                } else {
                    toast(`❌ Invalid address provided`);
                }
            } else if (e.classList.contains("gen-mnemonics-before")) {
                if (!is_connected()) return;

                const name = qs(".pseudo-name").value;
                if (name) {
                    hide(".gen-mnemonics-before");
                    appear(".gen-mnemonics-after");

                    // send request to chain
                    fetch("/gen-keys", {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "name": name
                        })
                    })
                        .then(async res => {
                            await res.json().then(res => {
                                hide(".gen-mnemonics-after");
                                appear(".gen-mnemonics-before");

                                if (!res.error) {
                                    const ss58_addr = res.data.ss58_addr;
                                    clearField(".pseudo-name");
                                    appear(".mnemonics-container");
                                    toast(`You have <code class="bold">10 seconds</code> to copy your keys`);

                                    qs(".mnemonic-seed").innerText = res.data.seed;
                                    qs(".kilt-did-result").innerText = ss58_addr;
                                    updateAuthUser(ss58_addr, name);

                                    // set session nonce
                                    setSessionNonce(res.data.nonce);

                                    // set timeout to remove div
                                    setTimeout(() => hide(".mnemonics-container"), 10000);
                                } else {
                                    appear(".mnemonic-error-text");
                                    setTimeout(() => hide(".mnemonic-error-text"), 5000);
                                }
                            });
                            ;
                        })
                } else {
                    toast(`❌ Please fill in you name to continue`);
                }
            } else if (e.classList.contains("sign-in-btn-before")) {
                let seed = qs(".seed-phrase-ta").value;
                if (seed.split(` `).length != 12)
                    toast("❌ seed phrases must be complete 12 words only.");
                else {
                    hide(".sign-in-btn-before");
                    appear(".sign-in-btn-after");

                    queryServerToSignIn(seed, true);
                }
            } else if (e.classList.contains("copy-to-clipboard")) {
                // copy to clipboard
                let copy_text = qs(`.${e.dataset.target}`).innerText;

                if (!navigator.clipboard)
                    toast("Clipboard API not supported");

                navigator.clipboard.writeText(copy_text).then(() => {
                    toast("Text copied to clipboard!");
                }, () => {
                    toast("Failed to copy text to clipboard");
                });
            } else if (e.classList.contains("submit-filled-document-before")) {
                if (!is_connected()) return;
                if (userIsAuth()) {
                    let allFilled = true;
                    qsa(".form-document-properties").forEach(e => {
                        if (!e.value)
                            allFilled = false;
                    });

                    if (allFilled) {
                        hide(".submit-filled-document-before");
                        appear(".submit-filled-document-after");

                        // take all the values
                        let values = [];
                        let labels = [];
                        qsa(".form-document-properties").forEach(e => {
                            values.push(e.value);
                        })

                        qsa(".form-important-label").forEach(l => {
                            labels.push(l.innerText);
                        })

                        const important_vals = qs(".document-type-selector").value.split("$$$");

                        // send to server
                        fetch("/submit-document", {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "values": values.join("~"),
                                "title": important_vals[0],
                                "labels": labels.join("~"),
                                "key": important_vals[3],
                                "nonce": getSessionNonce()
                            })
                        })
                            .then(async res => {
                                await res.json().then(res => {
                                    hide(".submit-filled-document-after");
                                    appear(".submit-filled-document-before");

                                    if (!res.error) {
                                        appear(".document-reg-success");
                                        setTimeout(() => hide(".document-reg-success"), 5000);
                                        hide(".document-indicator");
                                        hide(".property-document-container");
                                        qs(".document-property-body").innerHTML = "";

                                    } else {
                                        appear(".document-reg-error");
                                        setTimeout(() => hide(".document-reg-error"), 5000);
                                    }
                                });
                                ;
                            })
                    } else {
                        toast(`❌ Please fill out all fields of the document.`);
                    }
                }
            } else if (e.classList.contains("property-search0-btn-before")) {
                if (!is_connected()) return;
                const authAddr = qs(".substrate-address-input").value;

                if (isValidSS58Addr(authAddr)) {
                    hide(".property-search0-btn-before");
                    appear(".property-search0-btn-after");

                    // send request to chain
                    fetch("/fetch-ptypes", {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "address": authAddr,
                            "nonce": getSessionNonce()
                        })
                    })
                        .then(async res => {
                            await res.json().then(res => {
                                hide(".property-search0-btn-after");
                                appear(".property-search0-btn-before");

                                if (!res.error) {
                                    appear(".document-select-option-2");

                                    // populate UI
                                    let select = qs(".property-type-selector");
                                    select.innerHTML = `<option class="select-option" value="zero">Select the right document from this menu</option>`;
                                    [].forEach.call(res.data, (p) => {
                                        console.log(p);
                                        select.innerHTML += `<option value="${p.slug}" class="select-option" data-props="${p.attributes.join("$$$")}">${p.name}</option>`;
                                    });
                                } else {
                                    toast(`❌ ${res.data.msg}`);
                                }
                            });
                        })
                } else {
                    toast("❌ Please input a valid substrate address");
                }
            } else if (e.classList.contains("transfer-property-btn-before")) {
                if (!is_connected()) return;
                if (userIsAuth()) {
                    let recipient = qs(".recipient-addr");
                    let psize = qs(".trans-property-size");
                    let allFilled = true;
                    let values = [];
                    let total_size = parseInt(qs(".property-size").innerText.split(' ')[1]);

                    qsa(".trans-document-properties").forEach(e => {
                        if (!e.value)
                            allFilled = false;
                        values.push(e.value);
                    });

                    if (psize.value > total_size) {
                        toast("You cannot transfer more property than you possess");
                        return;
                    }

                    if (allFilled && recipient.value && psize.value) {
                        hide(".transfer-property-btn-before");
                        appear(".transfer-property-btn-after");

                        qs(".trans-property-size").disabled = true;
                        qs(".input-for-transfer").disabled = true;

                        // disable the search button
                        qs(".transfer-search-btn-before").disabled = true;

                        // send to server
                        fetch("/transfer-property", {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "values": values.join("~"),
                                "recipient": recipient.value,
                                "transferAll": psize.value == total_size,
                                "propertySize": qs(".trans-property-size").value,
                                "totalSize": qs(".property-size").innerText,
                                "propertyId": qs(".trans-document-title").dataset.pid,
                                "nonce": getSessionNonce()
                            })
                        })
                            .then(async res => {
                                await res.json().then(res => {
                                    qs(".trans-property-size").disabled = false;
                                    qs(".input-for-transfer").disabled = false;
                                    qs(".transfer-search-btn-before").disabled = false;

                                    appear(".transfer-property-btn-before");
                                    hide(".transfer-property-btn-after");

                                    if (!res.error) {
                                        clearField(".input-for-transfer");
                                        hide(".document-trans-indicator");
                                        hide(".document-trans-container");

                                        appear(".property-transfer-success");
                                        setTimeout(() => hide(".property-transfer-success"), 5000);
                                    } else {
                                        qs(".main-error-text").innerText = `❌ ${res.data.msg}`;
                                        appear(".property-transfer-error");
                                        setTimeout(() => hide(".property-transfer-error"), 5000);
                                    }
                                });
                                ;
                            })
                    } else {
                        toast(`❌ Please fill out all fields of the document.`);
                    }
                }
            } else if (e.classList.contains("search-pdoc-btn-before")) {
                if (!is_connected()) return;
                let propertyID = qs(".input-for-signature").value;
                if (propertyID) {
                    hide(".search-pdoc-btn-before");
                    appear(".search-pdoc-btn-after");

                    // fetch specific document from IPFS
                    fetch("/fetch-property", {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "propertyId": propertyID,
                            "nonce": getSessionNonce()
                        })
                    })
                        .then(async res => {
                            await res.json().then(res => {
                                appear(".search-pdoc-btn-before");
                                hide(".search-pdoc-btn-after");

                                if (!res.error) {
                                    appear(".document-sig-indicator");
                                    appear(".document-sig-container");
                                    qs(".sig-document-title").innerText = res.data.title;
                                    qs(".sig-document-title").dataset.pid = propertyID;
                                    qs(".property-claimer").innerText = res.data.claimer;

                                    // set the property type
                                    qs(".sig-document-title").dataset.ptype = res.data.propertyTypeId;

                                    let div = qs(".document-sig-body");
                                    div.innerHTML = "";
                                    Object.entries(res.data.attr).forEach(([k, v]) => {
                                        div.innerHTML += `
                                                <div class="mb-3 col-6">
                                                    <label for="size of property" class="form-label">${k}</label>
                                                    <input type="text"
                                                        class="form-control form-control-sm sig-document-properties"
                                                        id="" placeholder="" value="${v}" disabled>
                                                </div>
                                            `;
                                    })
                                } else {
                                    hide(".document-sig-indicator");
                                    hide(".document-sig-container");
                                    qs(".document-sig-error").innerText = `❌ Could not locate property claim. Please check your input.`;
                                    appear(".document-sig-error");
                                    setTimeout(() => hide(".document-sig-error"), 5000);
                                }
                            });
                            ;
                        })
                } else {
                    toast(`❌ please fill in a valid property ID.`);
                }
            } else if (e.classList.contains("sign-document-btn-before")) {
                if (!is_connected()) return;
                hide(".sign-document-btn-before");
                appear(".sign-document-btn-after");
                qs(".search-pdoc-btn-before").disabled = true;
                let propertID = qs(".input-for-signature").value;

                // fetch specific document from IPFS
                fetch("/sign-claim", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "propertyId": propertID,
                        "propertyTypeId": qs(".sig-document-title").dataset.ptype,
                        "nonce": getSessionNonce()
                    })
                })
                    .then(async res => {
                        await res.json().then(res => {
                            appear(".sign-document-btn-before");
                            hide(".sign-document-btn-after");
                            qs(".search-pdoc-btn-before").disabled = false;

                            if (!res.error) {
                                clearField(".input-for-signature");
                                hide(".document-sig-indicator");
                                hide(".document-sig-container");

                                appear(".document-sig-success");
                                setTimeout(() => hide(".document-sig-success"), 5000);
                            } else {
                                qs(".document-sig-error").innerText = `❌ Could not append signature. Please try again later`;
                                appear(".document-sig-error");
                                setTimeout(() => hide(".document-sig-error"), 5000);
                            }
                        });
                        ;
                    })
            } else if (e.classList.contains("make-enquiry-btn-before")) {
                if (!is_connected()) return;
                let propertID = qs(".pid-for-enquiry").value;
                if (propertID) {
                    hide(".make-enquiry-btn-before");
                    appear(".make-enquiry-btn-after");
                    hide(".enquiry-container");

                    // fetch specific document from IPFS
                    fetch("/enquire", {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "propertyId": propertID,
                            "nonce": getSessionNonce()
                        })
                    })
                        .then(async res => {
                            await res.json().then(res => {
                                appear(".make-enquiry-btn-before");
                                hide(".make-enquiry-btn-after");
                                appear(".enquiry-container");

                                if (!res.error) {
                                    clearField(".pid-for-enquiry");

                                    qsa(".prop-id").forEach(p => {
                                        p.innerText = propertID;
                                    });

                                    qsa(".claimer-id").forEach(p => {
                                        p.innerText = res.data.claimer;
                                    });

                                    qsa(".claimers-list").forEach(cl => {
                                        cl.innerHTML = "";
                                        let index = 0;
                                        res.data.claimers.forEach(e => {
                                            cl.innerHTML += `${e} ${res.data.claimers[index + 1] ? " ➡ " : ""}`;
                                            index++;
                                        });
                                    });

                                    if (res.data.isValid) {
                                        appear(".positive-verdict");
                                        hide(".negative-verdict");
                                        qs(".verdict-datetime").innerText = convertTimestampString(res.data.timestamp);
                                    } else {
                                        hide(".positive-verdict");
                                        appear(".negative-verdict");
                                    }
                                } else {
                                    hide(".negative-verdict");
                                    hide(".positive-verdict");
                                    appear(".enquiry-error");
                                    setTimeout(() => hide(".enquiry-error"), 5000);
                                }
                            });
                            ;
                        })
                } else {
                    toast(`❌ please fill in a valid property ID.`);
                }
            } else if (e.classList.contains("transfer-search-btn-before")) {
                if (!is_connected()) return;
                let propertID = qs(".input-for-transfer").value;
                if (propertID) {
                    hide(".transfer-search-btn-before");
                    appear(".transfer-search-btn-after");

                    // fetch specific document from IPFS
                    fetch("/fetch-property", {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "propertyId": propertID,
                            "nonce": getSessionNonce()
                        })
                    })
                        .then(async res => {
                            await res.json().then(res => {
                                appear(".transfer-search-btn-before");
                                hide(".transfer-search-btn-after");

                                if (!res.error) {
                                    appear(".document-trans-indicator");
                                    appear(".document-trans-container");
                                    qs(".trans-document-title").innerText = `${res.data.title} - Transfer Document`;
                                    qs(".trans-document-title").dataset.pid = propertID;

                                    let div = qs(".document-trans-body");
                                    div.innerHTML = "";
                                    let index = 0;
                                    Object.entries(res.data.attr).forEach(([k, v]) => {
                                        div.innerHTML += `
                                                <div class="mb-3 col-6">
                                                    <label for="size of property" class="form-label">${k}</label>
                                                    <input type="text"
                                                        class="form-control form-control-sm trans-document-properties ${index == 1 ? "transfer-nsize" : ""}"
                                                         value="${!index ? v : ""}" ${index < 2 ? "disabled" : ""}>
                                                </div>
                                            `;

                                        if (index == 1) {
                                            qs(".trans-property-size").max = parseInt(v.split(' ')[0]);
                                            qs(".property-size").innerText = `of ${v}`;
                                        }
                                        index++;
                                    })

                                    // set initial transfer value
                                    qs(".transfer-nsize").value = `1 ${qs(".property-size").innerText.split(' ')[2]}`;

                                } else {
                                    hide(".document-trans-indicator");
                                    hide(".document-trans-container");
                                    qs(".main-error-text").innerText = `Could not locate property claim. Please check your input.`;
                                    appear(".property-transfer-error");
                                    setTimeout(() => hide(".property-transfer-error"), 5000);
                                }
                            });
                            ;
                        })
                } else {
                    toast(`❌ please fill in a valid property ID.`);
                }
            } else if (e.classList.contains("copy")) {
                navigator.clipboard.writeText(qs(`.${e.dataset.class}`).innerText);
                toast("Copied to clipboard");
            }
        } else {
            toast(`waiting to connect to the <code>contracts</code> chain.`);
        }
    },
    false
);

qs(".trans-property-size").addEventListener("keyup", (e) => {
    qs(".transfer-nsize").value = `${e.target.value} ${qs(".property-size").innerText.split(' ')[2]}`;
}, false);

document.body.addEventListener(
    "change",
    (e) => {
        e = e.target;
        if (e.classList.contains("document-type-selector")) {
            // fetch the details from the network
            let docBody = qs(".document-property-body");
            docBody.innerHTML = "";
            if (e.value != "zero") {
                const attributes = e.children[e.selectedIndex].dataset.props.split("$$$");

                appear(".document-indicator");
                appear(".property-document-container");
                qs(".document-title").innerText = e.children[e.selectedIndex].innerText;

                [].forEach.call(attributes, (a) => {
                    docBody.innerHTML += `
                    <div class="mb-3 col-6">
                        <label for="${a}"
                            class="form-label form-important-label">${a}</label>
                        <input type="text" class="form-control form-control-sm form-document-properties"
                            id="${a}"
                            placeholder="">
                    </div>
                `;
                });
            } else {
                hide(".document-indicator");
                hide(".property-document-container");
            }
        } else if (e.classList.contains("property-type-selector")) {
            let select = qs(".property-type-selector");

            if (select.value != "zero") {
                // fetch all the property titles from the chain
                if (!is_connected()) return;
                fetch("/fetch-properties", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        value: select.value,
                        "nonce": getSessionNonce()
                    })
                })
                    .then(async res => {
                        await res.json().then(res => {
                            let cc = qs(".credential-container");
                            cc.innerHTML = "";
                            if (!res.error) {
                                // update the UI
                                let i = 0;
                                res.data.forEach(p => {
                                    i++;

                                    // property details
                                    const details = p.attributes.map((attribute, index) => {
                                        const label = p.labels[index];
                                        return `<div class="property-detail-x"><code>${label}:</code> ${attribute}</div>`;
                                    }).join('');

                                    cc.innerHTML += `
                            <hr>
                            <div class="mt-10 row pr-10">
                                <div class="col-4 pt-30">
                                    <img src="img/file.png" class="width-100">
                                </div>
                                <div class="col-8 card border-0">
                                    <div class="card-body">
                                        <code class="bold small">Property #${i}</code>
                                        <div class="mt-20 bold">
                                            <code>ID:</code>
                                            <span class="xx-${p.id.substr(0, 7)}">${p.id}</span>
                                            <span class="copy-to-clipboard pointer" data-target="xx-${p.id.substr(0, 7)}">
                                                        <svg class="copy-to-clipboard" data-target="xx-${p.id.substr(0, 7)}"
                                                            viewBox="0 -0.5 25 25" height="24" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                                stroke-linejoin="round"></g>
                                                            <g id="SVGRepo_iconCarrier">
                                                                <path class="copy-to-clipboard"
                                                                    data-target="xx-${p.id.substr(0, 7)}"
                                                                    d="M8.25005 8.5C8.25005 8.91421 8.58584 9.25 9.00005 9.25C9.41426 9.25 9.75005 8.91421 9.75005 8.5H8.25005ZM9.00005 8.267H9.75006L9.75004 8.26283L9.00005 8.267ZM9.93892 5.96432L10.4722 6.49171L9.93892 5.96432ZM12.2311 5V4.24999L12.2269 4.25001L12.2311 5ZM16.269 5L16.2732 4.25H16.269V5ZM18.5612 5.96432L18.0279 6.49171V6.49171L18.5612 5.96432ZM19.5 8.267L18.75 8.26283V8.267H19.5ZM19.5 12.233H18.75L18.7501 12.2372L19.5 12.233ZM18.5612 14.5357L18.0279 14.0083L18.5612 14.5357ZM16.269 15.5V16.25L16.2732 16.25L16.269 15.5ZM16 14.75C15.5858 14.75 15.25 15.0858 15.25 15.5C15.25 15.9142 15.5858 16.25 16 16.25V14.75ZM9.00005 9.25C9.41426 9.25 9.75005 8.91421 9.75005 8.5C9.75005 8.08579 9.41426 7.75 9.00005 7.75V9.25ZM8.73105 8.5V7.74999L8.72691 7.75001L8.73105 8.5ZM6.43892 9.46432L6.97218 9.99171L6.43892 9.46432ZM5.50005 11.767H6.25006L6.25004 11.7628L5.50005 11.767ZM5.50005 15.734L6.25005 15.7379V15.734H5.50005ZM8.73105 19L8.72691 19.75H8.73105V19ZM12.769 19V19.75L12.7732 19.75L12.769 19ZM15.0612 18.0357L14.5279 17.5083L15.0612 18.0357ZM16 15.733H15.25L15.2501 15.7372L16 15.733ZM16.75 15.5C16.75 15.0858 16.4143 14.75 16 14.75C15.5858 14.75 15.25 15.0858 15.25 15.5H16.75ZM9.00005 7.75C8.58584 7.75 8.25005 8.08579 8.25005 8.5C8.25005 8.91421 8.58584 9.25 9.00005 9.25V7.75ZM12.7691 8.5L12.7732 7.75H12.7691V8.5ZM15.0612 9.46432L15.5944 8.93694V8.93694L15.0612 9.46432ZM16.0001 11.767L15.2501 11.7628V11.767H16.0001ZM15.2501 15.5C15.2501 15.9142 15.5858 16.25 16.0001 16.25C16.4143 16.25 16.7501 15.9142 16.7501 15.5H15.2501ZM9.75005 8.5V8.267H8.25005V8.5H9.75005ZM9.75004 8.26283C9.74636 7.60005 10.0061 6.96296 10.4722 6.49171L9.40566 5.43694C8.65985 6.19106 8.24417 7.21056 8.25006 8.27117L9.75004 8.26283ZM10.4722 6.49171C10.9382 6.02046 11.5724 5.75365 12.2352 5.74999L12.2269 4.25001C11.1663 4.25587 10.1515 4.68282 9.40566 5.43694L10.4722 6.49171ZM12.2311 5.75H16.269V4.25H12.2311V5.75ZM16.2649 5.74999C16.9277 5.75365 17.5619 6.02046 18.0279 6.49171L19.0944 5.43694C18.3486 4.68282 17.3338 4.25587 16.2732 4.25001L16.2649 5.74999ZM18.0279 6.49171C18.494 6.96296 18.7537 7.60005 18.7501 8.26283L20.25 8.27117C20.2559 7.21056 19.8402 6.19106 19.0944 5.43694L18.0279 6.49171ZM18.75 8.267V12.233H20.25V8.267H18.75ZM18.7501 12.2372C18.7537 12.8999 18.494 13.537 18.0279 14.0083L19.0944 15.0631C19.8402 14.3089 20.2559 13.2894 20.25 12.2288L18.7501 12.2372ZM18.0279 14.0083C17.5619 14.4795 16.9277 14.7463 16.2649 14.75L16.2732 16.25C17.3338 16.2441 18.3486 15.8172 19.0944 15.0631L18.0279 14.0083ZM16.269 14.75H16V16.25H16.269V14.75ZM9.00005 7.75H8.73105V9.25H9.00005V7.75ZM8.72691 7.75001C7.6663 7.75587 6.65146 8.18282 5.90566 8.93694L6.97218 9.99171C7.43824 9.52046 8.07241 9.25365 8.73519 9.24999L8.72691 7.75001ZM5.90566 8.93694C5.15985 9.69106 4.74417 10.7106 4.75006 11.7712L6.25004 11.7628C6.24636 11.1001 6.50612 10.463 6.97218 9.99171L5.90566 8.93694ZM4.75005 11.767V15.734H6.25005V11.767H4.75005ZM4.75006 15.7301C4.73847 17.9382 6.51879 19.7378 8.72691 19.75L8.7352 18.25C7.35533 18.2424 6.2428 17.1178 6.25004 15.7379L4.75006 15.7301ZM8.73105 19.75H12.769V18.25H8.73105V19.75ZM12.7732 19.75C13.8338 19.7441 14.8486 19.3172 15.5944 18.5631L14.5279 17.5083C14.0619 17.9795 13.4277 18.2463 12.7649 18.25L12.7732 19.75ZM15.5944 18.5631C16.3402 17.8089 16.7559 16.7894 16.75 15.7288L15.2501 15.7372C15.2537 16.3999 14.994 17.037 14.5279 17.5083L15.5944 18.5631ZM16.75 15.733V15.5H15.25V15.733H16.75ZM9.00005 9.25H12.7691V7.75H9.00005V9.25ZM12.7649 9.24999C13.4277 9.25365 14.0619 9.52046 14.5279 9.99171L15.5944 8.93694C14.8486 8.18282 13.8338 7.75587 12.7732 7.75001L12.7649 9.24999ZM14.5279 9.99171C14.994 10.463 15.2537 11.1001 15.2501 11.7628L16.75 11.7712C16.7559 10.7106 16.3402 9.69106 15.5944 8.93694L14.5279 9.99171ZM15.2501 11.767V15.5H16.7501V11.767H15.2501Z"
                                                                    fill="#000000"></path>
                                                            </g>
                                                        </svg>
                                                    </span>
                                        </div>
                                        <div class="">
                                            <code>Claimer:</code>
                                            ${p.claimer}
                                        </div>
                                        <div>
                                            <code>Details:</code>
                                            <div class="pl-20">
                                                ${details}
                                            </div>
                                        </div>
                                        <div class="">
                                            <code>Claim Submission Timestamp:</code> ${p.timestamp != '0' ? convertTimestamp(parseInt(p.timestamp)) : "Nil"}
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        `;
                                });
                                console.log(res.data);
                            } else {
                                appear(".prop-search-error");
                                setTimeout(() => hide(".prop-search-error"), 5000);
                            }
                        });
                    })
            }
        }
    }, false);



// prevent forms from submitting normally
let forms = document.getElementsByTagName("form");
[].forEach.call(forms, (f) => {
    f.onsubmit = function () { return false };
});