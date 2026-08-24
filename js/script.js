/**  Card Generator  **/

function generateVCard() {
    const get = (selector) => {
        const el = document.querySelector(selector);
        if (!el.getAttribute("href")) return el?.textContent?.trim();
        if (el.getAttribute("href"))
            return el
                .getAttribute("href")
                .replace(/^(?:mailto:|https:\/\/wa\.me\/55)/, "");
        return false;
    };
    const splitName = (name) => {
        const [lastName, ...firstName] = name.split(" ").reverse();
        return { firstName: firstName.join(" "), lastName };
    };

    const fn = get('[data-vcard="fn"]');
    const { firstName, lastName } = splitName(fn);
    const email = get('[data-vcard="email"]');
    const tel = get('[data-vcard="tel"]');
    const linkedin = get('[data-vcard="linkedin"]');
    const github = get('[data-vcard="github"]');

    const lines = [
        "BEGIN:VCARD",
        "VERSION:4.0",
        `N:${lastName};${firstName};;;`,
        `FN:${fn}`,
        tel && `TEL;TYPE=CELL:${tel}`,
        email && `EMAIL:${email}`,
        `URL:${window.location.href}`,
        linkedin && `URL;TYPE=linkedin:${linkedin}`,
        github && `URL;TYPE=github:${github}`,
        "END:VCARD",
    ];

    return lines.filter(Boolean).join("\r\n");
}

function downloadVCard() {
    const vcard = generateVCard();

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `rodrigo-tormente.vcf`;
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

/**  Shared  **/

function shared() {
    const shareData = {
        title: "Rodrigo Tormente - Infraestrutura",
        text: "Confira os contatos e redes sociais!",
        url: `${window.location.href}`,
    };

    console.log(navigator.share);

    if (navigator.share) {
        navigator
            .share(shareData)
            .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
        console.log("Web Share API não suportada neste navegador.");
    }
}

/**  QR Code  **/
function generateQRCode() {
    //const qrUrl = `${location.origin}${location.pathname}#add`;
    const qr = document.createElement("img");
    qr.src = "./img/qr.png";
    qr.alt = "QR Code";
    qr.width = 400;
    qr.height = 400;

    return qr;
}

function openQR() {
    const qr = generateQRCode();
    createModal(qr);
}

function includeQR(e) {
    const note = document.getElementById("contact__note");
    const qr = note.querySelector("#qrimg");

    if (e.matches) {
        if (!qr) {
            const img = document.createElement("img");
            img.src = "./img/qrcode.png";
            img.alt = "QR Code";
            img.id = "qrimg";

            note.prepend(img);
        }
    } else {
        if (qr) {
            qr.remove();
        }
    }
}

/**  Generic Function  **/

function createModal(htmlContent) {
    if (
        typeof HTMLDialogElement === "function" &&
        typeof HTMLDialogElement.prototype.showModal === "function"
    ) {
        const mdl = document.createElement("dialog");
        const closeBtn = document.createElement("button");

        mdl.classList.add("modal");

        closeBtn.textContent = "x";
        closeBtn.setAttribute("aria-label", "Fechar modal");
        closeBtn.classList.add("close-btn");

        closeBtn.addEventListener("click", () => mdl.close());
        mdl.appendChild(closeBtn);
        mdl.addEventListener("click", (e) => {
            if (e.target === mdl) {
                mdl.close();
            }
        });
        mdl.addEventListener("close", () => mdl.remove());

        mdl.appendChild(htmlContent);
        document.body.appendChild(mdl);
        mdl.showModal();
    } else {
        console.warn("Sem suporte a <dialog> ou o método showModal().");
    }
}

/**  Page Load  **/
const mediaQuery = window.matchMedia("(min-width: 801px)");

includeQR(mediaQuery);
mediaQuery.addEventListener("change", includeQR);

document
    .querySelector("#profile__save")
    .addEventListener("click", () => downloadVCard());

document.querySelector("#profile__share").addEventListener("click", shared);

if (window.location.hash === "#add") {
    downloadVCard();
    window.history.replaceState(null, null, " ");
}
