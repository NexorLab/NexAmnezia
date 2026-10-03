const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const newKeysBtn = document.getElementById("newKeysBtn");

const configBox = document.getElementById("config");
const clientPublicKeyBox = document.getElementById("clientPublicKey");
const endpointList = document.getElementById("endpointList");


/*
 * Endpoint presets
 * 52 endpoints taken from the reference page.
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


let clientPrivateKey = "";
let clientPublicKey = "";


/*
 * Get text value from an input.
 */
function getValue(id) {
    return document.getElementById(id).value.trim();
}


/*
 * Get numeric value from an input.
 */
function getNumber(id) {
    const value = getValue(id);

    return value === "" ? null : Number(value);
}


/*
 * Convert byte array to Base64.
 */
function bytesToBase64(bytes) {
    let binary = "";

    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}


/*
 * Generate client WireGuard-style key pair.
 */
function generateClientKeys() {

    if (typeof nacl === "undefined") {
        alert("Cryptographic library failed to load.");
        return false;
    }

    const keyPair = nacl.box.keyPair();

    clientPrivateKey = bytesToBase64(keyPair.secretKey);
    clientPublicKey = bytesToBase64(keyPair.publicKey);

    clientPublicKeyBox.value = clientPublicKey;

    return true;
}


/*
 * Validate a Base64 32-byte key.
 */
function isValidBase64Key(value) {

    if (!value) {
        return false;
    }

    try {

        const normalized = value.trim();

        if (normalized.length !== 44) {
            return false;
        }

        const decoded = atob(normalized);

        return decoded.length === 32;

    } catch (error) {

        return false;
    }
}


/*
 * Create endpoint preset list.
 */
function buildEndpointList() {

    endpointList.innerHTML = "";

    endpointPresets.forEach((endpoint) => {

        const item = document.createElement("div");

        item.className = "endpoint-item";

        item.dataset.endpoint = endpoint;

        const text = document.createElement("span");

        text.className = "endpoint-ip";

        text.textContent = endpoint;

        const tick = document.createElement("span");

        tick.className = "endpoint-tick";

        tick.textContent = "✓";

        item.appendChild(text);
        item.appendChild(tick);

        item.addEventListener("click", () => {

            selectEndpoint(item, endpoint);

        });

        endpointList.appendChild(item);

    });
}


/*
 * Select an endpoint and fill IP / Port fields.
 */
function selectEndpoint(item, endpoint) {

    const separator = endpoint.lastIndexOf(":");

    if (separator === -1) {
        return;
    }

    const server = endpoint.substring(0, separator);
    const port = endpoint.substring(separator + 1);

    document.getElementById("server").value = server;
    document.getElementById("port").value = port;

    document
        .querySelectorAll(".endpoint-item")
        .forEach((element) => {
            element.classList.remove("selected");
        });

    item.classList.add("selected");

    configBox.value = "";
}


/*
 * Select the default endpoint.
 */
function selectDefaultEndpoint() {

    const defaultEndpoint = "8.6.112.138:987";

    const item = Array.from(
        document.querySelectorAll(".endpoint-item")
    ).find(
        (element) =>
            element.dataset.endpoint === defaultEndpoint
    );

    if (item) {
        selectEndpoint(item, defaultEndpoint);
    }
}


/*
 * Validate a number field.
 */
function validateNumber(id, name, min, max) {

    const value = getNumber(id);

    if (value === null) {

        alert(`${name} is required.`);

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
 * Validate server / IP / domain.
 */
function validateServer() {

    const server = getValue("server");

    if (!server) {

        alert("Please enter an IP address or domain.");

        return false;
    }

    if (/\s/.test(server)) {

        alert("IP / Domain must not contain spaces.");

        return false;
    }

    return true;
}


/*
 * Validate port.
 */
function validatePort() {

    const port = getNumber("port");

    if (port === null) {

        alert("Please enter a port.");

        return false;
    }

    if (
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535
    ) {

        alert("Port must be between 1 and 65535.");

        return false;
    }

    return true;
}


/*
 * Validate all form fields.
 */
function validateFields() {

    if (!validateServer()) return false;

    if (!validatePort()) return false;

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

        alert("Please enter a client address.");

        return false;
    }

    if (!getValue("dns")) {

        alert("Please enter a DNS server.");

        return false;
    }


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

    if (
        !validateNumber(
            "s3",
            "S3",
            0,
            65535
        )
    ) {
        return false;
    }

    if (
        !validateNumber(
            "s4",
            "S4",
            0,
            65535
        )
    ) {
        return false;
    }


    if (!getValue("h1")) {

        alert("Please enter H1.");

        return false;
    }

    if (!getValue("h2")) {

        alert("Please enter H2.");

        return false;
    }

    if (!getValue("h3")) {

        alert("Please enter H3.");

        return false;
    }

    if (!getValue("h4")) {

        alert("Please enter H4.");

        return false;
    }


    /*
     * Server Public Key is optional.
     */
    const serverPublicKey = getValue("publicKey");

    if (
        serverPublicKey &&
        !isValidBase64Key(serverPublicKey)
    ) {

        alert(
            "Server Public Key must be a valid 32-byte Base64 WireGuard key."
        );

        return false;
    }


    if (!getValue("allowedIPs")) {

        alert("Please enter Allowed IPs.");

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


/*
 * Generate configuration.
 */
function generateConfig() {

    if (!validateFields()) {
        return;
    }


    const server = getValue("server");
    const port = getNumber("port");

    const mtu = getNumber("mtu");
    const address = getValue("address");
    const dns = getValue("dns");


    const jc = getNumber("jc");
    const jmin = getNumber("jmin");
    const jmax = getNumber("jmax");


    const s1 = getNumber("s1");
    const s2 = getNumber("s2");
    const s3 = getNumber("s3");
    const s4 = getNumber("s4");


    const h1 = getValue("h1");
    const h2 = getValue("h2");
    const h3 = getValue("h3");
    const h4 = getValue("h4");


    const i1 = getValue("i1");
    const i2 = getValue("i2");
    const i3 = getValue("i3");
    const i4 = getValue("i4");
    const i5 = getValue("i5");


    const serverPublicKey = getValue("publicKey");

    const allowedIPs = getValue("allowedIPs");

    const keepalive = getNumber("keepalive");


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

        `S3 = ${s3}`,

        `S4 = ${s4}`,

        `H1 = ${h1}`,

        `H2 = ${h2}`,

        `H3 = ${h3}`,

        `H4 = ${h4}`

    ];


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


    lines.push(

        "",

        "[Peer]",

        `PublicKey = ${
            serverPublicKey ||
            "YOUR_SERVER_PUBLIC_KEY"
        }`,

        `AllowedIPs = ${allowedIPs}`,

        `Endpoint = ${server}:${port}`,

        `PersistentKeepalive = ${keepalive}`

    );


    configBox.value = lines.join("\n");
}


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

        alert("New client keys generated.");

    }
);


/*
 * Generate configuration button.
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

                document.execCommand("copy");

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


        const blob = new Blob(
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


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        URL.revokeObjectURL(url);

    }
);


/*
 * Build endpoint list and initialize page.
 */
buildEndpointList();

selectDefaultEndpoint();

generateClientKeys();
