const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const configBox = document.getElementById("config");

generateBtn.addEventListener("click", generateConfig);

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function generateConfig() {
    const server = getValue("server");
    const port = getValue("port");
    const mtu = getValue("mtu");

    const jc = getValue("jc");
    const jmin = getValue("jmin");
    const jmax = getValue("jmax");

    const s1 = getValue("s1");
    const s2 = getValue("s2");

    const h1 = getValue("h1");
    const h2 = getValue("h2");
    const h3 = getValue("h3");
    const h4 = getValue("h4");

    if (!server) {
        alert("Please enter an IP address or domain.");
        return;
    }

    if (!port) {
        alert("Please enter a port.");
        return;
    }

    const config = `[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.0.0.2/32
DNS = 1.1.1.1
MTU = ${mtu}

Jc = ${jc}
Jmin = ${jmin}
Jmax = ${jmax}
S1 = ${s1}
S2 = ${s2}
H1 = ${h1}
H2 = ${h2}
H3 = ${h3}
H4 = ${h4}

[Peer]
PublicKey = YOUR_SERVER_PUBLIC_KEY
AllowedIPs = 0.0.0.0/0
Endpoint = ${server}:${port}
PersistentKeepalive = 25`;

    configBox.value = config;
}

copyBtn.addEventListener("click", async () => {
    if (!configBox.value) {
        alert("Generate a configuration first.");
        return;
    }

    try {
        await navigator.clipboard.writeText(configBox.value);
        alert("Configuration copied.");
    } catch (error) {
        alert("Could not copy the configuration.");
    }
});

downloadBtn.addEventListener("click", () => {
    if (!configBox.value) {
        alert("Generate a configuration first.");
        return;
    }

    const blob = new Blob(
        [configBox.value],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "nexamnezia.conf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
});
