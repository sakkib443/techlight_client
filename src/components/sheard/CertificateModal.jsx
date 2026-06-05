"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuDownload, LuEye, LuAward, LuBadgeCheck } from "react-icons/lu";
import { generateCertificatePDF, previewCertificatePDF } from "@/utils/generateCertificatePDF";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500 work">{label}</span>
    <span className="text-sm font-semibold text-gray-800 text-right">{value || "—"}</span>
  </div>
);

const CertificateModal = ({ certificate, onClose, onDownload }) => {
  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!certificate) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleKey);
    };
  }, [certificate, onClose]);

  if (typeof document === "undefined") return null;

  const handleDownload = async () => {
    await generateCertificatePDF(certificate);
    if (onDownload) onDownload(certificate);
  };

  return createPortal(
    <AnimatePresence>
      {certificate && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 border border-gray-200 text-gray-500 hover:text-[#E31E27] hover:border-[#E31E27] transition-colors shadow-sm"
              >
                <LuX className="text-lg" />
              </button>

              {/* Certificate preview */}
              <div className="p-5 sm:p-8">
                <div className="relative border-2 border-[#E31E27] rounded-xl overflow-hidden bg-gradient-to-br from-[#e8f9f9] via-white to-[#fff8f0]">
                  <div className="m-2 border border-[#E31E27]/30 rounded-lg px-6 py-8 sm:px-10 sm:py-10 text-center">
                    {/* Brand */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-2xl font-extrabold tracking-tight outfit">
                        <span className="text-[#E31E27]">TECH</span>
                        <span className="text-gray-800">LIGHT</span>
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase mb-6">
                      IT Institute
                    </p>

                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                      <LuAward className="text-[#E31E27]" />
                      <span className="text-xs font-medium text-gray-600 work">Certificate of Completion</span>
                    </div>

                    <p className="text-sm text-gray-500 work mb-2">This is to certify that</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#E31E27] outfit mb-2">
                      {certificate.studentName || certificate.name}
                    </h2>
                    <p className="text-sm text-gray-500 work mb-2">has successfully completed the course</p>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 outfit mb-6 max-w-xl mx-auto">
                      {certificate.courseName || certificate.title}
                    </h3>

                    <div className="flex items-center justify-center gap-2 text-[#38a89d]">
                      <LuBadgeCheck className="text-lg" />
                      <span className="text-xs font-medium work">
                        Verified Certificate · {certificate.certificateNumber || certificate.studentId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-gray-800 outfit mb-2 flex items-center gap-2">
                    <LuAward className="text-[#E31E27]" />
                    Certificate Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <DetailRow label="Student Name" value={certificate.studentName || certificate.name} />
                    <DetailRow label="Student ID" value={certificate.studentId} />
                    <DetailRow label="Course" value={certificate.courseName || certificate.title} />
                    <DetailRow label="Batch" value={certificate.batchName} />
                    <DetailRow label="Mentor" value={certificate.mentorName} />
                    <DetailRow
                      label="Duration"
                      value={
                        certificate.startDate
                          ? `${formatDate(certificate.startDate)} – ${formatDate(certificate.endDate)}`
                          : certificate.duration
                      }
                    />
                    <DetailRow label="Issue Date" value={formatDate(certificate.issueDate)} />
                    <DetailRow label="Grade" value={certificate.grade} />
                    <DetailRow label="Certificate No." value={certificate.certificateNumber || certificate.studentId} />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#E31E27] hover:bg-[#C01920] text-white font-medium rounded-lg transition-colors"
                  >
                    <LuDownload />
                    Download Certificate
                  </button>
                  <button
                    onClick={() => previewCertificatePDF(certificate)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-[#38a89d] hover:text-[#38a89d] transition-colors"
                  >
                    <LuEye />
                    Preview PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CertificateModal;
