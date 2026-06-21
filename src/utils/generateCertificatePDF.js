// ===================================================================
// Techlight IT Solution - Certificate PDF Generator
// Overlays the dynamic certificate data on top of the client-supplied
// design template (public/certificate formate.pdf) using pdf-lib, so the
// output is pixel-for-pixel the official certificate layout.
//
// The template page is 1600 x 1131 pt. Because the supplied demo image
// (public/certificate demo.jpg) is exactly 1600 x 1131 px, every text
// anchor below was measured directly off that demo (top-left origin) and
// converted to pdf-lib's bottom-left origin via Y(). The certificate
// content is visually centered on x = 846 (NOT the page centre 800).
// ===================================================================

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Public path to the design template (filename has a space -> encode it).
const TEMPLATE_URL = '/certificate%20formate.pdf';

// ==================== Layout constants (measured from the demo) ====================
const PAGE_H = 1131;
const CENTER_X = 846; // visual centre of the certificate content

// Colours sampled from the demo certificate.
const NAME_RED = rgb(0.49, 0.08, 0.06); // deep red recipient name (~#7D1410)
const MAROON = rgb(0.35, 0.07, 0.05);   // course / body maroon (~#5A1210)
const INK = rgb(0.07, 0.07, 0.07);      // near-black date values

// Each field: pixel baseline (from top), font size, and where it sits.
const NAME = { baseline: 632, size: 64, maxWidth: 1040 };
const COURSE = { x: 669, baseline: 718, size: 44, maxWidth: 831 };
const START = { x: 481, baseline: 815, size: 38 };
const END = { x: 530, baseline: 854, size: 38 };
const DURATION = { x: 530, baseline: 893, size: 38 };
const ISSUE = { x: 561, baseline: 930, size: 38 };

// ==================== Field resolvers ====================
const getStudentName = (cert) => (cert?.studentName || cert?.name || '').trim();
const getCourseLabel = (cert) =>
    (cert?.courseName || cert?.title || cert?.batchName || cert?.course?.title || '').trim();
const getStartDate = (cert) => cert?.startDate || cert?.certificateBatch?.startDate;
const getEndDate = (cert) => cert?.endDate || cert?.certificateBatch?.endDate;
const getDurationHours = (cert) =>
    cert?.durationHours ?? cert?.certificateBatch?.durationHours ?? null;
const getIssueDate = (cert) => cert?.issueDate || new Date();
const getCertificateNumber = (cert) =>
    cert?.certificateNumber || cert?.certificateId || cert?.studentId || 'certificate';

// ==================== Helpers ====================
// "26th May 2026" - day with ordinal suffix, full month, year.
const ordinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const fmtDate = (d) => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return `${ordinal(dt.getDate())} ${dt.toLocaleString('en-US', { month: 'long' })} ${dt.getFullYear()}`;
};

// pdf-lib draws StandardFonts with WinAnsi encoding and throws on any character
// it cannot encode. Keep every character the font supports and drop only the
// unsupported ones, so an unusual name never breaks the whole document.
const toEncodable = (font, raw) => {
    const text = String(raw);
    try {
        font.widthOfTextAtSize(text, 12);
        return text;
    } catch {
        let out = '';
        for (const ch of text) {
            try {
                font.widthOfTextAtSize(ch, 12);
                out += ch;
            } catch {
                /* drop unsupported char */
            }
        }
        return out;
    }
};

// ==================== Build the document ====================
const buildDoc = async (cert) => {
    const res = await fetch(TEMPLATE_URL);
    if (!res.ok) throw new Error(`Could not load certificate template (${res.status})`);
    const templateBytes = await res.arrayBuffer();

    const pdf = await PDFDocument.load(templateBytes);
    const page = pdf.getPages()[0];
    const times = await pdf.embedFont(StandardFonts.TimesRoman);
    const timesBold = await pdf.embedFont(StandardFonts.TimesRomanBold);

    // pixel baseline (top origin) -> pdf-lib y (bottom origin)
    const Y = (px) => PAGE_H - px;

    // Shrink the font until the text fits within maxWidth (keeps long values on one line).
    const fit = (text, font, size, maxWidth) => {
        let s = size;
        while (maxWidth && font.widthOfTextAtSize(text, s) > maxWidth && s > 8) s -= 1;
        return s;
    };

    const drawCentered = (raw, { baseline, size, maxWidth }, font, color) => {
        const text = toEncodable(font, raw);
        if (!text.trim()) return;
        const s = fit(text, font, size, maxWidth);
        const w = font.widthOfTextAtSize(text, s);
        page.drawText(text, { x: CENTER_X - w / 2, y: Y(baseline), size: s, font, color });
    };

    const drawLeft = (raw, { x, baseline, size, maxWidth }, font, color) => {
        const text = toEncodable(font, raw);
        if (!text.trim()) return;
        const s = fit(text, font, size, maxWidth);
        page.drawText(text, { x, y: Y(baseline), size: s, font, color });
    };

    // 1) Recipient name - centred between "acknowledge that" and "Has successfully completed the"
    drawCentered(getStudentName(cert), NAME, timesBold, NAME_RED);

    // 2) Course / program - quoted, right after "...completed the"
    const course = getCourseLabel(cert);
    if (course) drawLeft(`“${course}”`, COURSE, timesBold, MAROON);

    // 3) Training Start / End / Duration / Certificate Issue Date - values after the printed labels
    const start = getStartDate(cert);
    const end = getEndDate(cert);
    const hours = getDurationHours(cert);
    if (start) drawLeft(fmtDate(start), START, times, INK);
    if (end) drawLeft(fmtDate(end), END, times, INK);
    if (hours !== null && hours !== undefined && hours !== '') {
        drawLeft(`${hours} Hours`, DURATION, times, INK);
    }
    drawLeft(fmtDate(getIssueDate(cert)), ISSUE, times, INK);

    return pdf;
};

// ==================== Public API ====================
/**
 * Generate and download the certificate as a PDF file.
 */
export async function generateCertificatePDF(cert) {
    const pdf = await buildDoc(cert);
    const bytes = await pdf.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate-${getCertificateNumber(cert)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Open the certificate PDF in a new browser tab (preview).
 * The window is opened synchronously to avoid popup blocking.
 */
export async function previewCertificatePDF(cert) {
    const win = typeof window !== 'undefined' ? window.open('', '_blank') : null;
    try {
        const pdf = await buildDoc(cert);
        const bytes = await pdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        if (win) win.location.href = url;
        else if (typeof window !== 'undefined') window.open(url, '_blank');
    } catch (err) {
        if (win) win.close();
        throw err;
    }
}

export default generateCertificatePDF;
