// ===================================================================
// Techlight IT Institute - Certificate PDF Generator
// Builds a standard, professional certificate PDF from certificate data
// using jsPDF (no extra dependency, runs in the browser).
// ===================================================================

import { jsPDF } from 'jspdf';

/**
 * Resolve a human-readable course label from a certificate object.
 */
const getCourseLabel = (cert) =>
    cert?.title || cert?.courseName || cert?.course?.title || 'Course';

const getBatchName = (cert) => cert?.batch?.batchName || '';

const formatDate = (value) => {
    const d = value ? new Date(value) : new Date();
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Build the certificate into a jsPDF document (shared by save + preview).
 */
const buildDoc = (cert) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth(); // ~297
    const H = doc.internal.pageSize.getHeight(); // ~210

    const brand = [122, 133, 240]; // #E31E27
    const dark = [30, 41, 59]; // slate-800
    const gray = [100, 116, 139]; // slate-500

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, 'F');

    // Decorative border (double line)
    doc.setDrawColor(brand[0], brand[1], brand[2]);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, W - 20, H - 20);
    doc.setLineWidth(0.4);
    doc.rect(14, 14, W - 28, H - 28);

    // Brand wordmark "Techlight"
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(brand[0], brand[1], brand[2]);
    doc.text('TECH', W / 2, 32, { align: 'right' });
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('LIGHT', W / 2, 32, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('IT INSTITUTE', W / 2, 38, { align: 'center' });

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('Certificate of Completion', W / 2, 60, { align: 'center' });

    // Divider
    doc.setDrawColor(brand[0], brand[1], brand[2]);
    doc.setLineWidth(0.6);
    doc.line(W / 2 - 28, 66, W / 2 + 28, 66);

    // Intro line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('This is to certify that', W / 2, 82, { align: 'center' });

    // Student name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(brand[0], brand[1], brand[2]);
    doc.text(cert?.studentName || 'Student Name', W / 2, 96, { align: 'center' });

    // Completion line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('has successfully completed the course', W / 2, 108, { align: 'center' });

    // Course name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text(getCourseLabel(cert), W / 2, 120, { align: 'center', maxWidth: W - 80 });

    // Batch (optional)
    const batchName = getBatchName(cert);
    if (batchName) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(gray[0], gray[1], gray[2]);
        doc.text(`Batch: ${batchName}`, W / 2, 129, { align: 'center' });
    }

    // ===== Footer row: Date | Signature | Certificate No =====
    const footY = 168;

    // Date (left)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text(formatDate(cert?.issueDate), 50, footY - 3, { align: 'center' });
    doc.setDrawColor(gray[0], gray[1], gray[2]);
    doc.setLineWidth(0.3);
    doc.line(28, footY, 72, footY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('Date of Issue', 50, footY + 5, { align: 'center' });

    // Signature (center)
    doc.setDrawColor(gray[0], gray[1], gray[2]);
    doc.line(W / 2 - 28, footY, W / 2 + 28, footY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('Techlight IT Institute', W / 2, footY + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('Authorized Signature', W / 2, footY + 10, { align: 'center' });

    // Certificate No (right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text(cert?.certificateNumber || '-', W - 50, footY - 3, { align: 'center' });
    doc.setDrawColor(gray[0], gray[1], gray[2]);
    doc.line(W - 72, footY, W - 28, footY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text('Certificate No.', W - 50, footY + 5, { align: 'center' });

    // Verify line
    doc.setFontSize(7.5);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text(
        `Verify this certificate at techlightitinstitute.com/verify/${cert?.certificateNumber || ''}`,
        W / 2,
        H - 16,
        { align: 'center' }
    );

    return doc;
};

/**
 * Generate and download the certificate as a PDF file.
 */
export function generateCertificatePDF(cert) {
    const doc = buildDoc(cert);
    const fileName = `Certificate-${cert?.certificateNumber || 'techlight'}.pdf`;
    doc.save(fileName);
}

/**
 * Open the certificate PDF in a new browser tab (preview without download).
 */
export function previewCertificatePDF(cert) {
    const doc = buildDoc(cert);
    const url = doc.output('bloburl');
    window.open(url, '_blank');
}

export default generateCertificatePDF;
