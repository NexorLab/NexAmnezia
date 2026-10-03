const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const newKeysBtn = document.getElementById("newKeysBtn");

const configBox = document.getElementById("config");
const clientPublicKeyBox =
    document.getElementById("clientPublicKey");

const endpointList =
    document.getElementById("endpointList");

const customJunkSettings =
    document.getElementById("customJunkSettings");

const enableIParameters =
    document.getElementById("enableIParameters");

const iParameters =
    document.getElementById("iParameters");

const advancedToggle =
    document.getElementById("advancedToggle");

const advancedParameters =
    document.getElementById("advancedParameters");


/*
 * ==========================================
 * ENDPOINT PRESETS
 * ==========================================
 */

const endpointPresets = [

    "8.6.112.224:5279",
    "8.6.112.46:903",
    "8.6.112.206:3854",
    "8.6.112.31:859",
    "8.6.112.113:864",
    "8.6.112.60:5279",
    "8.6.112.219:4198",
    "8.6.112.104:878",
    "8.6.112.132:8854",
    "8.6.112.162:987",
    "8.6.112.90:955",
    "8.6.112.121:500",
    "8.6.112.208:2408",
    "8.6.112.146:942",
    "8.6.112.204:943",
    "8.6.112.138:8886",
    "8.6.112.148:890",
    "8.6.112.55:854",
    "8.6.112.82:987",
    "8.6.112.42:1010",
    "8.6.112.112:1387",
    "8.6.112.194:859",
    "8.6.112.45:5279",
    "8.6.112.168:934",
    "8.6.112.152:942",
    "8.6.112.138:987",
    "8.6.112.38:8319",
    "8.6.112.217:864",
    "8.6.112.155:8854",
    "8.6.112.225:943",
    "8.6.112.121:903",
    "8.6.112.10:1701",
    "8.6.112.232:1180",
    "8.6.112.44:1018",
    "8.6.112.135:8319",
    "8.6.112.96:4198",
    "8.6.112.31:3581",
    "8.6.112.27:942",
    "8.6.112.83:5956",
    "8.6.112.213:1014",
    "8.6.112.242:908",
    "8.6.112.40:7559",
    "8.6.112.132:908",
    "8.6.112.120:878",
    "8.6.112.230:1014",
    "8.6.112.131:8886",
    "8.6.112.168:3476",
    "8.6.112.14:1074",
    "8.6.112.237:3138",
    "8.6.112.13:4177",
    "8.6.112.203:854",
    "8.6.112.161:7152"

];


/*
 * ==========================================
 * CLIENT KEYS
 * ==========================================
 */

let clientPrivateKey = "";
let clientPublicKey = "";
let warpData = null;


/*
 * ==========================================
 * HELPERS
 * ==========================================
 */

function getValue(id) {

    const element = document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value.trim();
}


function getNumber(id) {

    const value = getValue(id);

    if (value === "") {
        return null;
    }

    return Number(value);
}


/*
 * Convert Uint8Array to Base64.
 */

function bytesToBase64(bytes) {

    let binary = "";

    for (let i = 0; i < bytes.length; i++) {

        binary += String.fromCharCode(
            bytes[i]
        );

    }

    return btoa(binary);
}


/*
 * ==========================================
 * KEY GENERATION
 * ==========================================
 */

function generateClientKeys() {

    if (typeof nacl === "undefined") {

        alert(
            "Cryptographic library failed to load."
        );

        return false;
    }


    const keyPair =
        nacl.box.keyPair();


    clientPrivateKey =
        bytesToBase64(
            keyPair.secretKey
        );


    clientPublicKey =
        bytesToBase64(
            keyPair.publicKey
        );


    clientPublicKeyBox.value =
        clientPublicKey;


    return true;
}


/*
 * ==========================================
 * BASE64 KEY VALIDATION
 * ==========================================
 */

function isValidBase64Key(value) {

    if (!value) {
        return false;
    }


    try {

        const normalized =
            value.trim();


        if (normalized.length !== 44) {
            return false;
        }


        const decoded =
            atob(normalized);


        return decoded.length === 32;

    } catch (error) {

        return false;
    }
}


/*
 * ==========================================
 * ENDPOINT LIST
 * ==========================================
 */

function buildEndpointList() {

    endpointList.innerHTML = "";


    endpointPresets.forEach(
        (endpoint) => {

            const item =
                document.createElement("div");


            item.className =
                "endpoint-item";


            item.dataset.endpoint =
                endpoint;


            const text =
                document.createElement("span");


            text.className =
                "endpoint-ip";


            text.textContent =
                endpoint;


            const tick =
                document.createElement("span");


            tick.className =
                "endpoint-tick";


            tick.textContent =
                "✓";


            item.appendChild(text);

            item.appendChild(tick);


            item.addEventListener(
                "click",
                () => {

                    selectEndpoint(
                        item,
                        endpoint
                    );

                }
            );


            endpointList.appendChild(item);

        }
    );
}


/*
 * Select an endpoint.
 */

function selectEndpoint(
    item,
    endpoint
) {

    const separator =
        endpoint.lastIndexOf(":");


    if (separator === -1) {
        return;
    }


    const server =
        endpoint.substring(
            0,
            separator
        );


    const port =
        endpoint.substring(
            separator + 1
        );


    document.getElementById(
        "server"
    ).value = server;


    document.getElementById(
        "port"
    ).value = port;


    document
        .querySelectorAll(
            ".endpoint-item"
        )
        .forEach(
            (element) => {

                element.classList.remove(
                    "selected"
                );

            }
        );


    item.classList.add(
        "selected"
    );


    configBox.value = "";
}


/*
 * Default endpoint.
 */

function selectDefaultEndpoint() {

    const defaultEndpoint =
        "8.6.112.138:987";


    const item =
        Array.from(
            document.querySelectorAll(
                ".endpoint-item"
            )
        ).find(
            (element) =>
                element.dataset.endpoint ===
                defaultEndpoint
        );


    if (item) {

        selectEndpoint(
            item,
            defaultEndpoint
        );

    }
}


/*
 * ==========================================
 * JUNK PACKET PRESETS
 * ==========================================
 */

const junkPresets = {

    light: {

        jc: 3,
        jmin: 1,
        jmax: 3

    },

    heavy: {

        jc: 5,
        jmin: 10,
        jmax: 40

    }

};


/*
 * Set Junk Packet values.
 */

function setJunkValues(
    jc,
    jmin,
    jmax
) {

    document.getElementById(
        "jc"
    ).value = jc;


    document.getElementById(
        "jmin"
    ).value = jmin;


    document.getElementById(
        "jmax"
    ).value = jmax;
}


/*
 * Apply selected Junk Packet mode.
 */

function updateJunkPreset() {

    const selected =
        document.querySelector(
            'input[name="junkPreset"]:checked'
        );


    if (!selected) {
        return;
    }


    const mode =
        selected.value;


    if (
        mode === "light" ||
        mode === "heavy"
    ) {

        const preset =
            junkPresets[mode];


        setJunkValues(
            preset.jc,
            preset.jmin,
            preset.jmax
        );


        customJunkSettings.classList.add(
            "hidden"
        );


        return;
    }


    if (mode === "custom") {

        customJunkSettings.classList.remove(
            "hidden"
        );

    }

}


/*
 * ==========================================
 * AMNEZIA 1.5 I1-I5
 * ==========================================
 */

function updateIParametersVisibility() {

    if (
        enableIParameters.checked
    ) {

        iParameters.classList.remove(
            "hidden"
        );

    } else {

        iParameters.classList.add(
            "hidden"
        );

    }

}


/*
 * ==========================================
 * ADVANCED PARAMETERS
 * ==========================================
 */

function toggleAdvancedParameters() {

    const isHidden =
        advancedParameters.classList.contains(
            "hidden"
        );


    if (isHidden) {

        advancedParameters.classList.remove(
            "hidden"
        );


        advancedToggle.classList.add(
            "advanced-open"
        );

    } else {

        advancedParameters.classList.add(
            "hidden"
        );


        advancedToggle.classList.remove(
            "advanced-open"
        );

    }

}


/*
 * ==========================================
 * VALIDATION
 * ==========================================
 */

function validateNumber(
    id,
    name,
    min,
    max
) {

    const value =
        getNumber(id);


    if (value === null) {

        alert(
            `${name} is required.`
        );

        return false;
    }


    if (
        !Number.isInteger(value) ||
        value < min ||
        value > max
    ) {

        alert(
            `${name} must be an integer between ${min} and ${max}.`
        );

        return false;
    }


    return true;
}


/*
 * Validate server.
 */

function validateServer() {

    const server =
        getValue("server");


    if (!server) {

        alert(
            "Please enter an IP address or domain."
        );

        return false;
    }


    if (/\s/.test(server)) {

        alert(
            "IP / Domain must not contain spaces."
        );

        return false;
    }


    return true;
}


/*
 * Validate port.
 */

function validatePort() {

    const port =
        getNumber("port");


    if (port === null) {

        alert(
            "Please enter a port."
        );

        return false;
    }


    if (
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535
    ) {

        alert(
            "Port must be between 1 and 65535."
        );

        return false;
    }


    return true;
}


/*
 * ==========================================
 * MAIN VALIDATION
 * ==========================================
 */

function validateFields() {

    if (!validateServer()) {
        return false;
    }


    if (!validatePort()) {
        return false;
    }


    if (
        !validateNumber(
            "mtu",
            "MTU",
            576,
            9000
        )
    ) {

        return false;
    }


    if (!getValue("address")) {

        alert(
            "Please enter a client address."
        );

        return false;
    }


    if (!getValue("dns")) {

        alert(
            "Please enter a DNS server."
        );

        return false;
    }


    /*
     * Junk Packet validation.
     */

    if (
        !validateNumber(
            "jc",
            "Jc",
            0,
            128
        )
    ) {

        return false;
    }


    if (
        !validateNumber(
            "jmin",
            "Jmin",
            0,
            65535
        )
    ) {

        return false;
    }


    if (
        !validateNumber(
            "jmax",
            "Jmax",
            0,
            65535
        )
    ) {

        return false;
    }


    const jmin =
        getNumber("jmin");

    const jmax =
        getNumber("jmax");


    if (jmin > jmax) {

        alert(
            "Jmin cannot be greater than Jmax."
        );

        return false;
    }


    /*
     * Advanced S parameters.
     */

    if (
        !validateNumber(
            "s1",
            "S1",
            0,
            65535
        )
    ) {

        return false;
    }


    if (
        !validateNumber(
            "s2",
            "S2",
            0,
            65535
        )
    ) {

        return false;
    }


    /*
     * H parameters.
     */

    if (!getValue("h1")) {

        alert(
            "Please enter H1."
        );

        return false;
    }


    if (!getValue("h2")) {

        alert(
            "Please enter H2."
        );

        return false;
    }


    if (!getValue("h3")) {

        alert(
            "Please enter H3."
        );

        return false;
    }


    if (!getValue("h4")) {

        alert(
            "Please enter H4."
        );

        return false;
    }


    /*
     * Server Public Key is optional.
     */

    const serverPublicKey =
        getValue("publicKey");


    if (
        serverPublicKey &&
        !isValidBase64Key(
            serverPublicKey
        )
    ) {

        alert(
            "Server Public Key must be a valid 32-byte Base64 WireGuard key."
        );

        return false;
    }


    if (!getValue("allowedIPs")) {

        alert(
            "Please enter Allowed IPs."
        );

        return false;
    }


    if (
        !validateNumber(
            "keepalive",
            "Persistent Keepalive",
            0,
            65535
        )
    ) {

        return false;
    }


    /*
     * Generate client keys if needed.
     */

    if (
        !clientPrivateKey ||
        !clientPublicKey
    ) {

        if (!generateClientKeys()) {
            return false;
        }

    }


    return true;
}

async function testWorkerConnection() {
  try {
    const response = await fetch(
      "https://nexamnezia-api.nexpanelpro.workers.dev/test",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicKey: clientPublicKey
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Worker test failed");
    }

    console.log("NexAmnezia Worker:", data);

    alert(
      "Worker connection successful!\n\n" +
      "Public Key Length: " +
      data.received.publicKeyLength
    );

  } catch (error) {
    console.error("Worker connection error:", error);

    alert(
      "Worker connection failed:\n\n" +
      error.message
    );
  }
}

/*
 * ==========================================
 * GENERATE CONFIG
 * ==========================================
 */

async function generateConfig() {

    if (!validateFields()) {
        return;
    }


    /*
     * Get a real WARP configuration.
     *
     * The result is cached so repeated clicks
     * do not create additional WARP registrations.
     */

    if (!warpData) {

        try {

            generateBtn.disabled = true;

            generateBtn.textContent =
                "Connecting to WARP...";


            const response =
                await fetch(
                    "https://nexamnezia-api.nexpanelpro.workers.dev/warp",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            publicKey:
                                clientPublicKey
                        })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.ok
            ) {

                throw new Error(
                    data.error ||
                    "WARP API request failed."
                );

            }


            /*
             * Make sure the required WARP
             * information exists.
             */

            if (
                !data.config ||
                !data.config.peer ||
                !data.config.peer.publicKey ||
                !data.config.peer.endpoint
            ) {

                throw new Error(
                    "WARP API returned an incomplete configuration."
                );

            }


            warpData = data;


        } catch (error) {

            console.error(
                "NexAmnezia WARP error:",
                error
            );


            alert(
                "Could not get a WARP configuration.\n\n" +
                error.message
            );


            return;

        } finally {

            generateBtn.disabled = false;

            generateBtn.textContent =
                "Generate Config";

        }

    }


    /*
     * WARP values
     */

    const warpInterface =
        warpData.config.interface;


    const warpPeer =
        warpData.config.peer;


    const selectedServer =
    getValue("server");

    
    const selectedPort =
        getNumber("port");

    
    const server =
        `${selectedServer}:${selectedPort}`;


    console.log("Selected Endpoint:", server);


    const serverPublicKey =
        warpPeer.publicKey;


    /*
     * Use the real WARP IPv4 address.
     *
     * WARP returns it without the CIDR suffix,
     * so /32 is added for WireGuard.
     */

    let address =
        warpInterface.ipv4;


    if (
        address &&
        !address.includes("/")
    ) {

        address += "/32";

    }


    /*
     * User-controlled settings
     */

    const mtu =
        getNumber("mtu");


    const dns =
        getValue("dns");


    const jc =
        getNumber("jc");


    const jmin =
        getNumber("jmin");


    const jmax =
        getNumber("jmax");


    const s1 =
        getNumber("s1");


    const s2 =
        getNumber("s2");


    const h1 =
        getValue("h1");


    const h2 =
        getValue("h2");


    const h3 =
        getValue("h3");


    const h4 =
        getValue("h4");


    const allowedIPs =
        getValue("allowedIPs");


    const keepalive =
        getNumber("keepalive");


    const lines = [

        "[Interface]",

        `PrivateKey = ${clientPrivateKey}`,

        `Address = ${address}`,

        `DNS = ${dns}`,

        `MTU = ${mtu}`,

        "",

        `Jc = ${jc}`,

        `Jmin = ${jmin}`,

        `Jmax = ${jmax}`,

        `S1 = ${s1}`,

        `S2 = ${s2}`,

        `H1 = ${h1}`,

        `H2 = ${h2}`,

        `H3 = ${h3}`,

        `H4 = ${h4}`

    ];


    /*
     * I1-I5
     */

    if (
        enableIParameters.checked
    ) {

        const i1 =
            getValue("i1");

        const i2 =
            getValue("i2");

        const i3 =
            getValue("i3");

        const i4 =
            getValue("i4");

        const i5 =
            getValue("i5");


        if (i1) {
            lines.push(`I1 = ${i1}`);
        }

        if (i2) {
            lines.push(`I2 = ${i2}`);
        }

        if (i3) {
            lines.push(`I3 = ${i3}`);
        }

        if (i4) {
            lines.push(`I4 = ${i4}`);
        }

        if (i5) {
            lines.push(`I5 = ${i5}`);
        }

    }


    /*
     * Real WARP Peer
     */

    lines.push(

        "",

        "[Peer]",

        `PublicKey = ${serverPublicKey}`,

        `AllowedIPs = ${allowedIPs}`,

        `Endpoint = ${server}`,

        `PersistentKeepalive = ${keepalive}`

    );


    /*
     * Display configuration
     */

    configBox.value =
        lines.join("\n");


    /*
     * Log WARP account information
     * for the next UI step.
     */

    console.log(
        "WARP Account Details:",
        warpData.account
    );

}

/*
 * ==========================================
 * EVENT LISTENERS
 * ==========================================
 */


/*
 * Junk Packet radio buttons.
 */

document
    .querySelectorAll(
        'input[name="junkPreset"]'
    )
    .forEach(
        (radio) => {

            radio.addEventListener(
                "change",
                updateJunkPreset
            );

        }
    );


/*
 * Amnezia 1.5 switch.
 */

enableIParameters.addEventListener(
    "change",
    () => {

        updateIParametersVisibility();

        configBox.value = "";

    }
);


/*
 * Advanced section.
 */

advancedToggle.addEventListener(
    "click",
    () => {

        toggleAdvancedParameters();

    }
);


/*
 * Generate new client keys.
 */

newKeysBtn.addEventListener(
    "click",
    () => {

        if (!generateClientKeys()) {
            return;
        }


        configBox.value = "";


        alert(
            "New client keys generated."
        );

    }
);

async function testWorkerConnection() {

    try {

        const response =
            await fetch(
                "https://nexamnezia-api.nexpanelpro.workers.dev/test",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        publicKey: clientPublicKey
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.ok) {

            throw new Error(
                data.error ||
                "Worker test failed."
            );

        }


        console.log(
            "NexAmnezia Worker:",
            data
        );


        alert(
            "Worker connection successful!\n\n" +
            "Public Key Length: " +
            data.received.publicKeyLength
        );


    } catch (error) {

        console.error(
            "Worker connection error:",
            error
        );


        alert(
            "Worker connection failed:\n\n" +
            error.message
        );

    }

}

/*
 * Generate configuration.
 */

generateBtn.addEventListener(
    "click",
    generateConfig
);


/*
 * Copy configuration.
 */

copyBtn.addEventListener(
    "click",
    async () => {

        if (!configBox.value.trim()) {

            alert(
                "Generate a configuration first."
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                configBox.value
            );


            alert(
                "Configuration copied."
            );

        } catch (error) {

            configBox.focus();

            configBox.select();


            try {

                document.execCommand(
                    "copy"
                );


                alert(
                    "Configuration copied."
                );

            } catch (copyError) {

                alert(
                    "Could not copy the configuration."
                );

            }

        }

    }
);


/*
 * Download configuration.
 */

downloadBtn.addEventListener(
    "click",
    () => {

        if (!configBox.value.trim()) {

            alert(
                "Generate a configuration first."
            );

            return;
        }


        const blob =
            new Blob(
                [configBox.value],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            "nexamnezia.conf";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(url);

    }
);


/*
 * ==========================================
 * INITIALIZE PAGE
 * ==========================================
 */

buildEndpointList();

selectDefaultEndpoint();

generateClientKeys();

updateJunkPreset();

updateIParametersVisibility();
