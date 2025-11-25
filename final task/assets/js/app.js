document.addEventListener("DOMContentLoaded", () => {
    highlightActiveNav();
    drawCanvasSachet();
    drawFeelWord();
    initPrivacyModal();
    initFilePreview();
    wireRangePreview();
});

function highlightActiveNav() {
    const current = location.pathname.split("/").pop();
    document.querySelectorAll("nav a").forEach((link) => {
        const href = link.getAttribute("href");
        if (href === current || (href === "index.html" && current === "")) {
            link.setAttribute("aria-current", "page");
        }
    });
}

function drawCanvasSachet() {
    const canvas = document.getElementById("sachetCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    // background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "#fff7fb");
    bgGradient.addColorStop(1, "#f0c0d0");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // sachet body
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-0.08);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#d9a5c0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-60, -80);
    ctx.lineTo(60, -80);
    ctx.quadraticCurveTo(70, 0, 60, 80);
    ctx.lineTo(-60, 80);
    ctx.quadraticCurveTo(-70, 0, -60, -80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ribbon
    ctx.fillStyle = "#6a3b6d";
    ctx.fillRect(width / 2 - 55, height / 2 - 90, 110, 10);

    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2 - 95);
    ctx.lineTo(width / 2 + 25, height / 2 - 120);
    ctx.lineTo(width / 2 + 10, height / 2 - 95);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2 - 95);
    ctx.lineTo(width / 2 - 25, height / 2 - 120);
    ctx.lineTo(width / 2 - 10, height / 2 - 95);
    ctx.closePath();
    ctx.fill();

    // aromatic notes
    ctx.fillStyle = "#ffbf69";
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * 80 - 40 + width / 2;
        const y = Math.random() * 80 - 20 + height / 2;
        ctx.beginPath();
        ctx.arc(x, y, 8 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawFeelWord() {
    const canvas = document.getElementById("feelCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#ffadc6");
    gradient.addColorStop(0.5, "#f77bb6");
    gradient.addColorStop(1, "#c07dff");

    ctx.font = "700 56px 'Segoe UI', 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(106, 59, 109, 0.35)";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.strokeText("чувствуй", width / 2, height / 2);

    ctx.shadowBlur = 0;
    ctx.fillStyle = gradient;
    ctx.fillText("чувствуй", width / 2, height / 2);

    // floating aroma particles
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 191, 105, ${0.3 + Math.random() * 0.4})`;
        const radius = 4 + Math.random() * 6;
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function wireRangePreview() {
    const range = document.getElementById("intensityRange");
    const output = document.getElementById("intensityValue");
    if (!range || !output) return;
    const setValue = (val) => (output.textContent = `${val}%`);
    setValue(range.value);
    range.addEventListener("input", (e) => setValue(e.target.value));
}

function initPrivacyModal() {
    const trigger = document.querySelector(".privacy-trigger");
    const modal = document.getElementById("privacyModal");
    if (!trigger || !modal) return;
    const closeBtn = modal.querySelector(".privacy-modal__close");
    if (!closeBtn) return;

    const openModal = () => {
        modal.hidden = false;
        document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
        modal.hidden = true;
        document.body.style.overflow = "";
    };

    trigger.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
}

function initFilePreview() {
    const input = document.getElementById("moodBoard");
    const preview = document.getElementById("moodPreview");
    if (!input || !preview) return;

    const resetPreview = () => {
        preview.textContent = "Файл не выбран.";
    };

    resetPreview();

    input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) {
            resetPreview();
            return;
        }

        const info = document.createElement("p");
        info.textContent = `Файл: ${file.name} (${Math.round(file.size / 1024)} КБ)`;

        preview.innerHTML = "";
        preview.appendChild(info);

        if (file.type && file.type.startsWith("image/")) {
            const img = document.createElement("img");
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    img.src = result;
                }
            };
            reader.readAsDataURL(file);
            preview.appendChild(img);
        } else {
            const note = document.createElement("p");
            note.textContent = "Невозможно показать превью этого формата, но файл прикреплён.";
            preview.appendChild(note);
        }
    });
}

