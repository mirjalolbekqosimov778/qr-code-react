import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./GetCam.css";

export default function GetCam() {
    const [text, setText] = useState("https://example.com");
    const [size, setSize] = useState(192); // canvas px
    const [bgWhite, setBgWhite] = useState(true);
    const [level, setLevel] = useState("L"); // L / M / Q / H
    const canvasId = "getcam-qrcode-canvas";
    const previewRef = useRef(null);

    useEffect(() => {
        // canvas element topib, blokli ko'rinish (pixel) va keskin qora-oq bo'lishini sozlaymiz
        const c = document.getElementById(canvasId);
        if (c) {
            // pixelated rendering in browsers
            c.style.imageRendering = "pixelated";
            // ensure no smoothing if drawn elsewhere later
            const ctx = c.getContext && c.getContext("2d");
            if (ctx) {
                ctx.imageSmoothingEnabled = false;
            }
        }
    }, [text, size, level, bgWhite]);

    const downloadPNG = () => {
        const c = document.getElementById(canvasId);
        if (!c) return alert("QR canvas topilmadi.");
        // create a temporary canvas to enlarge pixels for a chunky look in saved file
        const scale = 8; // yuklab olishda har bir modulni kattalashtirish (o'zing o'zgartir)
        const tmp = document.createElement("canvas");
        tmp.width = c.width * scale / (c.style.width ? (parseInt(c.style.width) || c.width) / c.width : 1);
        tmp.height = c.height * scale / (c.style.height ? (parseInt(c.style.height) || c.height) / c.height : 1);
        const tctx = tmp.getContext("2d");
        // disable smoothing so saved PNG ham blocky chiqadi
        tctx.imageSmoothingEnabled = false;
        // draw original canvas scaled up with nearest-neighbor (via imageSmoothingEnabled=false)
        tctx.drawImage(c, 0, 0, tmp.width, tmp.height);

        const url = tmp.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr_getcam.png";
        a.click();
    };

    return (
        <div className="gc-page">
            <div className="gc-card">
                <h1 className="gc-title">QR generator by Mirjalol</h1>

                <label className="gc-label">Matn yoki link</label>
                <input
                    className="gc-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://..."
                />

                <div className="gc-row">
                    <div>
                        <label className="gc-label">O‘lcham (px)</label>
                        <input
                            type="range"
                            min="128"
                            max="1024"
                            step="64"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                        />
                        <div className="gc-small">{size}px</div>
                    </div>

                    <div>
                        <label className="gc-label">Xatolik toʻgʻrilash</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="gc-select">
                            <option value="L">L (eng ko'p joy)</option>
                            <option value="M">M</option>
                            <option value="Q">Q</option>
                            <option value="H">H (eng kuchli)</option>
                        </select>
                    </div>

                    <div>
                        <label className="gc-label">Fon</label>
                        <div className="gc-toggle-row">
                            <label className="gc-switch">
                                <input type="checkbox" checked={bgWhite} onChange={() => setBgWhite((s) => !s)} />
                                <span className="gc-slider" />
                            </label>
                            <div className="gc-small">{bgWhite ? "Oq" : "Qora"}</div>
                        </div>
                    </div>
                </div>

                <div ref={previewRef} className="gc-preview">
                    {/* QRCodeCanvas qo'yamiz. id orqali canvasni olamiz */}
                    <QRCodeCanvas
                        id={canvasId}
                        value={text}
                        size={size}
                        bgColor={bgWhite ? "#ffffff" : "#000000"}
                        fgColor={bgWhite ? "#000000" : "#ffffff"}
                        level={level}
                        includeMargin={false}
                    />
                </div>

                <div className="gc-actions">
                    <button className="gc-btn gc-btn-primary" onClick={downloadPNG}>
                        PNG sifatida yuklab olish
                    </button>
                    <button
                        className="gc-btn"
                        onClick={() => {
                            navigator.clipboard
                                .writeText(text)
                                .then(() => alert("Matn clipboardga nusxalandi"))
                                .catch(() => alert("Clipboardga yozishda xatolik"));
                        }}
                    >
                        Matnni nusxalash
                    </button>
                </div>

            </div>
        </div>
    );
}
