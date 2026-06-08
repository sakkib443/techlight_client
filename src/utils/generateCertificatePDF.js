// ===================================================================
// Techlight IT Solution - Certificate PDF Generator
// Premium, professional certificate built with jsPDF (vector decoration
// + embedded Techlight logo). No extra dependencies.
// ===================================================================

import { jsPDF } from 'jspdf';

// ==================== Palette (RGB) ====================
const IVORY = [252, 250, 245];
const PANEL = [248, 244, 236];
const NAVY = [20, 33, 61];
const CHARCOAL = [30, 41, 59];
const GOLD = [176, 141, 87];
const GOLDL = [200, 160, 77];
const RED = [227, 30, 39];
const MUTED = [110, 116, 128];

// ==================== Field resolvers ====================
const getStudentName = (cert) => (cert?.studentName || cert?.name || 'Student Name').trim();
const getCourseLabel = (cert) =>
    (cert?.courseName || cert?.title || cert?.batchName || cert?.course?.title || 'the program').trim();
const getBatchName = (cert) => cert?.batchName || cert?.batch?.batchName || cert?.certificateBatch?.batchName || '';
const getMentorName = (cert) =>
    cert?.mentorName || cert?.certificateBatch?.mentorName || cert?.instructorName || '';
const getCertificateNumber = (cert) =>
    cert?.certificateNumber || cert?.certificateId || cert?.studentId || '-';
const getDuration = (cert) => {
    const start = cert?.startDate || cert?.certificateBatch?.startDate;
    const end = cert?.endDate || cert?.certificateBatch?.endDate;
    return { start, end };
};

const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
const deg = (a) => (a * Math.PI) / 180;

// ==================== Browser: load logo as data URL ====================
async function loadLogoDataUrl() {
    if (typeof window === 'undefined') return null;
    try {
        const res = await fetch('/images/logo.png');
        if (!res.ok) return null;
        const blob = await res.blob();
        return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

// ==================== Draw-state helpers ====================
const dr = (doc, c, w) => { doc.setDrawColor(c[0], c[1], c[2]); doc.setLineWidth(w); };
const fl = (doc, c) => doc.setFillColor(c[0], c[1], c[2]);
const tx = (doc, c) => doc.setTextColor(c[0], c[1], c[2]);

// Clean nested L-bracket corner (no dots/hatch); (sx,sy) ∈ {±1} mirror it.
function drawCorner(doc, cx, cy, sx, sy) {
    const o = 4, len = 16;
    dr(doc, GOLD, 0.7);
    doc.line(cx + sx * o, cy + sy * o, cx + sx * (o + len), cy + sy * o);
    doc.line(cx + sx * o, cy + sy * o, cx + sx * o, cy + sy * (o + len));
    dr(doc, GOLD, 0.4);
    doc.line(cx + sx * (o + 2), cy + sy * (o + 2), cx + sx * (o + len - 3), cy + sy * (o + 2));
    doc.line(cx + sx * (o + 2), cy + sy * (o + 2), cx + sx * (o + 2), cy + sy * (o + len - 3));
}

// Five-point star (10 triangles) — deliberately NOT six-point.
function drawStar5(doc, sx, sy, ro, ri, color) {
    fl(doc, color);
    for (let k = 0; k < 5; k++) {
        const t = deg(-90 + k * 72);
        const tip = [sx + ro * Math.cos(t), sy + ro * Math.sin(t)];
        const bL = [sx + ri * Math.cos(t - deg(36)), sy + ri * Math.sin(t - deg(36))];
        const bR = [sx + ri * Math.cos(t + deg(36)), sy + ri * Math.sin(t + deg(36))];
        doc.triangle(sx, sy, tip[0], tip[1], bL[0], bL[1], 'F');
        doc.triangle(sx, sy, tip[0], tip[1], bR[0], bR[1], 'F');
    }
}

// Gold wax-style medallion seal.
function drawSeal(doc, ox, oy) {
    fl(doc, GOLD);
    for (let i = 0; i < 28; i++) {
        const a = deg(i * (360 / 28));
        doc.circle(ox + 18 * Math.cos(a), oy + 18 * Math.sin(a), 1.3, 'F');
    }
    fl(doc, GOLD); doc.circle(ox, oy, 16.5, 'F');
    dr(doc, GOLDL, 1.0); doc.circle(ox, oy, 16.5, 'S');
    fl(doc, PANEL); doc.circle(ox, oy, 12.5, 'F');
    dr(doc, GOLDL, 0.5); doc.circle(ox, oy, 12.5, 'S');
    dr(doc, RED, 0.5); doc.circle(ox, oy, 12.5, 'S');
    fl(doc, GOLDL); doc.circle(ox, oy, 11, 'F');
    dr(doc, GOLD, 0.4); doc.circle(ox, oy, 11, 'S');
    drawStar5(doc, ox, oy - 5.5, 4.2, 1.6, GOLD);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6); tx(doc, NAVY);
    doc.text('CERTIFIED', ox, oy + 0.5, { align: 'center', charSpace: 0.6 });
    dr(doc, NAVY, 0.3); doc.line(ox - 7, oy + 2, ox + 7, oy + 2);
    doc.setFont('times', 'bold'); doc.setFontSize(6.5); tx(doc, NAVY);
    doc.text('TECHLIGHT', ox, oy + 5.5, { align: 'center', charSpace: 0.4 });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(4.5); tx(doc, RED);
    doc.text('IT SOLUTION', ox, oy + 8.5, { align: 'center', charSpace: 0.6 });
    fl(doc, RED);
    doc.triangle(ox - 5, oy + 15, ox - 2, oy + 23, ox, oy + 17, 'F');
    doc.triangle(ox + 5, oy + 15, ox + 2, oy + 23, ox, oy + 17, 'F');
}

// ==================== Build the certificate ====================
const buildDoc = (cert, logo) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();   // 297
    const H = doc.internal.pageSize.getHeight();   // 210
    const CX = W / 2;

    const name = getStudentName(cert);
    const course = getCourseLabel(cert);

    // Background + tonal panel
    fl(doc, IVORY); doc.rect(0, 0, W, H, 'F');
    fl(doc, PANEL); doc.rect(14, 14, 269, 182, 'F');

    // Triple border (gold → red → gold)
    dr(doc, GOLD, 1.4); doc.rect(16, 16, 265, 178, 'S');
    dr(doc, RED, 0.5); doc.rect(18.5, 18.5, 260, 173, 'S');
    dr(doc, GOLD, 0.7); doc.rect(21, 21, 255, 168, 'S');

    // Corner flourishes (top-left omitted — the logo anchors that corner)
    drawCorner(doc, 276, 21, -1, 1);
    drawCorner(doc, 21, 189, 1, -1);
    drawCorner(doc, 276, 189, -1, -1);

    // Header logo — top-left (with text fallback)
    let logoOk = false;
    if (logo) {
        try { doc.addImage(logo, 'PNG', 28, 25, 54, 17.82); logoOk = true; } catch { logoOk = false; }
    }
    if (!logoOk) {
        doc.setFont('times', 'bold'); doc.setFontSize(18); tx(doc, NAVY);
        doc.text('TECHLIGHT IT SOLUTION', 28, 38, { align: 'left', charSpace: 0 });
    }

    // Title + flourish underline
    doc.setFont('times', 'bold'); doc.setFontSize(40); tx(doc, NAVY);
    doc.text('Certificate of Completion', CX, 62, { align: 'center', charSpace: 0.3 });
    const fy = 70;
    dr(doc, GOLD, 0.6);
    doc.line(CX - 32, fy, CX - 4, fy);
    doc.line(CX + 4, fy, CX + 32, fy);
    fl(doc, RED);
    doc.triangle(CX, fy - 1.6, CX - 2, fy, CX, fy + 1.6, 'F');
    doc.triangle(CX, fy - 1.6, CX + 2, fy, CX, fy + 1.6, 'F');

    // Presented to
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); tx(doc, MUTED);
    doc.text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', CX, 86, { align: 'center', charSpace: 1.6 });

    // Recipient name + width-aware underline
    doc.setFont('times', 'bolditalic'); doc.setFontSize(34); tx(doc, NAVY);
    doc.text(name, CX, 100, { align: 'center', charSpace: 0 });
    const nameW = doc.getTextWidth(name);
    const uw = Math.min(180, Math.max(90, nameW + 24));
    dr(doc, GOLD, 0.5); doc.line(CX - uw / 2, 105, CX + uw / 2, 105);

    // Body paragraph (graceful fallbacks)
    const batch = getBatchName(cert);
    const { start, end } = getDuration(cert);
    let body = `has successfully completed the ${course} course`;
    if (batch) body += ` (${batch})`;
    if (start && end) body += `, held from ${fmt(start)} to ${fmt(end)}`;
    else if (end) body += `, completed on ${fmt(end)}`;
    body += ` at Techlight IT Solution.`;
    doc.setFont('times', 'normal'); doc.setFontSize(13.5); tx(doc, CHARCOAL);
    const lines = doc.splitTextToSize(body, 195);
    doc.text(lines, CX, 118, { align: 'center', lineHeightFactor: 1.5, charSpace: 0 });

    // Grade emphasis (fills the mid band)
    if (cert?.grade) {
        doc.setFont('times', 'bolditalic'); doc.setFontSize(13); tx(doc, GOLD);
        doc.text(`Grade Achieved :  ${cert.grade}`, CX, 148, { align: 'center', charSpace: 0.4 });
    }

    // ===== Footer =====
    // Left: certificate no. + optional student id
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); tx(doc, MUTED);
    doc.text('CERTIFICATE NO.', 34, 170, { align: 'left', charSpace: 1.0 });
    doc.setFont('times', 'bold'); doc.setFontSize(11); tx(doc, NAVY);
    doc.text(getCertificateNumber(cert), 34, 176, { align: 'left', charSpace: 0 });
    if (cert?.studentId) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); tx(doc, MUTED);
        doc.text('Student ID: ' + cert.studentId, 34, 181.5, { align: 'left', charSpace: 0 });
    }

    // Center-left: date of issue
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); tx(doc, MUTED);
    doc.text('DATE OF ISSUE', 92, 170, { align: 'left', charSpace: 1.0 });
    doc.setFont('times', 'bold'); doc.setFontSize(11); tx(doc, NAVY);
    doc.text(fmt(cert?.issueDate) || fmt(new Date()), 92, 176, { align: 'left', charSpace: 0 });

    // Center-right: signature (clear of the far-right seal)
    const mentor = getMentorName(cert);
    const sigx = 172;
    dr(doc, NAVY, 0.5); doc.line(sigx - 30, 174, sigx + 30, 174);
    if (mentor) {
        doc.setFont('times', 'bolditalic'); doc.setFontSize(12); tx(doc, NAVY);
        doc.text(mentor, sigx, 172, { align: 'center', charSpace: 0 });
    }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); tx(doc, NAVY);
    doc.text('AUTHORIZED SIGNATURE', sigx, 179, { align: 'center', charSpace: 0.8 });
    doc.setFont('times', 'italic'); doc.setFontSize(8.5); tx(doc, MUTED);
    doc.text('Director, Techlight IT Solution', sigx, 183.5, { align: 'center', charSpace: 0 });

    // Seal (drawn last, far-right corner)
    drawSeal(doc, 247, 148);

    return doc;
};

// ==================== Public API ====================
/**
 * Generate and download the certificate as a PDF file.
 */
export async function generateCertificatePDF(cert) {
    const logo = await loadLogoDataUrl();
    const doc = buildDoc(cert, logo);
    doc.save(`Certificate-${getCertificateNumber(cert)}.pdf`);
}

/**
 * Open the certificate PDF in a new browser tab (preview).
 * The window is opened synchronously to avoid popup blocking.
 */
export async function previewCertificatePDF(cert) {
    const win = typeof window !== 'undefined' ? window.open('', '_blank') : null;
    const logo = await loadLogoDataUrl();
    const doc = buildDoc(cert, logo);
    const url = doc.output('bloburl');
    if (win) win.location.href = url;
    else if (typeof window !== 'undefined') window.open(url, '_blank');
}

export default generateCertificatePDF;
