"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getSlug } from "@/i18n/pages";
import { validateContactInput } from "@/lib/contact/validation";

type FormProps = {
  locale: string;
  labels: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    organizationLabel: string;
    organizationPlaceholder: string;
    messageLabel: string;
    privacyConsentPrefix: string;
    privacyConsentLink: string;
    privacyConsentSuffix: string;
    privacyNote?: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successSubtitle?: string;
    backHome?: string;
    sendAnother?: string;
    errorTitle: string;
  };
  errorMessages?: Record<string, Record<string, string>>;
  invalidMessage?: string;
};

export default function ContactForm({
  locale,
  labels,
  errorMessages,
  invalidMessage,
}: FormProps) {
  const [formToken, setFormToken] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [website, setWebsite] = useState(""); // Honeypot

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<{
    email?: string;
    whatsapp?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        if (data.formToken) {
          setFormToken(data.formToken);
        }
      }
    } catch {
      // Ignore token fetch errors
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/contact")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.formToken) {
          setFormToken(data.formToken);
        }
      })
      .catch(() => {
        // Ignore token fetch errors on mount
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    setSuccessMessage(null);
    setAlternatives(null);

    // Validasi instan di sisi klien sebelum pengiriman
    const validation = validateContactInput({
      name,
      email,
      organization,
      phone: phone.trim() ? phone.trim() : undefined,
      message,
      privacyConsent,
    });

    if (!validation.ok) {
      const defaultErrors: Record<string, Record<string, string>> = {
        name: {
          required: locale === "id" ? "Nama wajib diisi." : "Name is required.",
          tooLong:
            locale === "id"
              ? "Nama paling panjang 100 karakter."
              : "Name cannot exceed 100 characters.",
          invalid:
            locale === "id"
              ? "Nama mengandung karakter yang tidak diizinkan."
              : "Name contains invalid characters.",
        },
        email: {
          required:
            locale === "id" ? "Email wajib diisi." : "Email is required.",
          tooLong:
            locale === "id"
              ? "Email paling panjang 254 karakter."
              : "Email cannot exceed 254 characters.",
          invalid:
            locale === "id"
              ? "Format email tidak valid."
              : "Invalid email address format.",
        },
        phone: {
          invalid:
            locale === "id"
              ? "Nomor WhatsApp harus diawali 08 atau +62, contoh 081234567890."
              : "WhatsApp number must start with 08 or +62, for example 081234567890.",
        },
        organization: {
          required:
            locale === "id"
              ? "Organisasi wajib diisi."
              : "Organization is required.",
          tooLong:
            locale === "id"
              ? "Organisasi paling panjang 150 karakter."
              : "Organization cannot exceed 150 characters.",
          invalid:
            locale === "id"
              ? "Organisasi mengandung karakter yang tidak diizinkan."
              : "Organization contains invalid characters.",
        },
        message: {
          required:
            locale === "id" ? "Pesan wajib diisi." : "Message is required.",
          tooLong:
            locale === "id"
              ? "Pesan paling panjang 5000 karakter."
              : "Message cannot exceed 5000 characters.",
          invalid:
            locale === "id"
              ? "Pesan mengandung karakter yang tidak diizinkan."
              : "Message contains invalid characters.",
        },
        privacyConsent: {
          required:
            locale === "id"
              ? "Centang persetujuan Kebijakan Privasi untuk mengirim pesan."
              : "Please check the Privacy Policy consent to send your message.",
        },
      };

      const localizedErrors: Record<string, string> = {};
      for (const [key, code] of Object.entries(validation.errors)) {
        localizedErrors[key] =
          errorMessages?.[key]?.[code] ||
          defaultErrors[key]?.[code] ||
          (code as string);
      }
      setFieldErrors(localizedErrors);
      setGeneralError(
        invalidMessage ||
          (locale === "id"
            ? "Periksa kembali kolom yang ditandai."
            : "Please check the marked fields.")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          organization,
          phone: phone.trim() ? phone.trim() : undefined,
          message,
          privacyConsent,
          locale,
          formToken,
          website,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.status === "sent") {
        setSuccessMessage(data.message);
        // Reset form inputs
        setName("");
        setEmail("");
        setPhone("");
        setOrganization("");
        setMessage("");
        setPrivacyConsent(false);
        // Refresh token for next submission
        refreshToken();
      } else {
        if (res.status === 422 && data.fields) {
          setFieldErrors(data.fields);
        }
        if (data.status === "expired") {
          refreshToken();
        }
        if (data.alternatives) {
          setAlternatives(data.alternatives);
        }
        setGeneralError(
          data.message ||
            (locale === "id"
              ? "Terjadi kesalahan. Silakan coba lagi."
              : "An error occurred. Please try again.")
        );
      }
    } catch {
      setGeneralError(
        locale === "id"
          ? "Gagal terhubung ke server. Periksa koneksi internet Anda."
          : "Failed to connect to server. Please check your internet connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
      {successMessage ? (
        <div className="flex flex-col items-center py-6 text-center md:py-10">
          {/* Green Check Icon */}
          <svg
            className="h-16 w-16 text-[#2E9D4E]"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M41 21A18 18 0 1 1 31.8 7.2" />
            <path d="m18 24 8 8 18-18" />
          </svg>

          {/* Judul Sukses */}
          <h3 className="mt-6 text-xl font-bold tracking-tight text-[#222222] md:text-2xl">
            {labels.successTitle}
          </h3>

          {/* Deskripsi */}
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#222222] md:text-base">
            {labels.successSubtitle ||
              (locale === "id"
                ? "Kami akan membalas lewat email Anda, atau WhatsApp bila Anda mengisinya"
                : "We will reply via your email, or WhatsApp if you provided it")}
          </p>

          {/* Tombol Kembali ke Beranda */}
          <Link
            href="/"
            className="mt-8 block w-full rounded-xl bg-[#222222] py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            {labels.backHome ||
              (locale === "id" ? "Kembali ke Beranda" : "Back to Home")}
          </Link>

          {/* Link Kirim Pesan Lain */}
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="mt-5 text-sm font-medium text-[#222222] underline underline-offset-4 transition hover:text-[#555555]"
          >
            {labels.sendAnother ||
              (locale === "id" ? "Kirim Pesan Lain" : "Send Another Message")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Honeypot field (hidden from real users) */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website-hp">Website</label>
            <input
              id="website-hp"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {generalError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">{labels.errorTitle}</p>
              <p className="mt-0.5">{generalError}</p>
              {alternatives && (
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  {alternatives.email && (
                    <a
                      href={`mailto:${alternatives.email}`}
                      className="font-medium underline hover:text-red-900"
                    >
                      Email: {alternatives.email}
                    </a>
                  )}
                  {alternatives.whatsapp && (
                    <a
                      href={alternatives.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline hover:text-red-900"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nama Field */}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-xs font-bold text-[#222222]"
            >
              {labels.nameLabel} <span className="text-[#EE4A1B]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              placeholder={labels.namePlaceholder}
              className={`mt-1.5 w-full rounded-md border px-3.5 py-2.5 text-sm text-[#222222] placeholder:text-[#999999] transition focus:outline-none focus:ring-1 ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E0E0E0] focus:border-[#222222] focus:ring-[#222222]"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="contact-email"
              className="block text-xs font-bold text-[#222222]"
            >
              {labels.emailLabel} <span className="text-[#EE4A1B]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              placeholder={labels.emailPlaceholder}
              className={`mt-1.5 w-full rounded-md border px-3.5 py-2.5 text-sm text-[#222222] placeholder:text-[#999999] transition focus:outline-none focus:ring-1 ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E0E0E0] focus:border-[#222222] focus:ring-[#222222]"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Nomor WhatsApp (opsional) */}
          <div>
            <label
              htmlFor="contact-phone"
              className="block text-xs font-bold text-[#222222]"
            >
              {labels.phoneLabel}
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (fieldErrors.phone) {
                  setFieldErrors((prev) => ({ ...prev, phone: "" }));
                }
              }}
              placeholder={labels.phonePlaceholder}
              className={`mt-1.5 w-full rounded-md border px-3.5 py-2.5 text-sm text-[#222222] placeholder:text-[#999999] transition focus:outline-none focus:ring-1 ${
                fieldErrors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E0E0E0] focus:border-[#222222] focus:ring-[#222222]"
              }`}
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Organisasi Field */}
          <div>
            <label
              htmlFor="contact-organization"
              className="block text-xs font-bold text-[#222222]"
            >
              {labels.organizationLabel} <span className="text-[#EE4A1B]">*</span>
            </label>
            <input
              id="contact-organization"
              type="text"
              name="organization"
              required
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                if (fieldErrors.organization) {
                  setFieldErrors((prev) => ({ ...prev, organization: "" }));
                }
              }}
              placeholder={labels.organizationPlaceholder}
              className={`mt-1.5 w-full rounded-md border px-3.5 py-2.5 text-sm text-[#222222] placeholder:text-[#999999] transition focus:outline-none focus:ring-1 ${
                fieldErrors.organization
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E0E0E0] focus:border-[#222222] focus:ring-[#222222]"
              }`}
            />
            {fieldErrors.organization && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.organization}
              </p>
            )}
          </div>

          {/* Pesan Field */}
          <div>
            <label
              htmlFor="contact-message"
              className="block text-xs font-bold text-[#222222]"
            >
              {labels.messageLabel} <span className="text-[#EE4A1B]">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (fieldErrors.message) {
                  setFieldErrors((prev) => ({ ...prev, message: "" }));
                }
              }}
              className={`mt-1.5 w-full rounded-md border px-3.5 py-2.5 text-sm text-[#222222] placeholder:text-[#999999] transition focus:outline-none focus:ring-1 ${
                fieldErrors.message
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#E0E0E0] focus:border-[#222222] focus:ring-[#222222]"
              }`}
            />
            {fieldErrors.message && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>
            )}
          </div>

          {/* Privacy Consent Checkbox */}
          <div>
            <div className="flex items-start gap-2.5">
              <input
                id="contact-privacy"
                type="checkbox"
                name="privacyConsent"
                checked={privacyConsent}
                onChange={(e) => {
                  setPrivacyConsent(e.target.checked);
                  if (fieldErrors.privacyConsent) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      privacyConsent: "",
                    }));
                  }
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#EB3113] focus:ring-[#EB3113]"
              />
              <label
                htmlFor="contact-privacy"
                className="text-xs leading-relaxed text-[#555555]"
              >
                {labels.privacyConsentPrefix}
                <Link
                  href={`/${getSlug("privacy", locale)}`}
                  className="font-medium text-[#222222] underline transition hover:text-[#EB3113]"
                >
                  {labels.privacyConsentLink}
                </Link>
                {labels.privacyConsentSuffix}
              </label>
            </div>
            {fieldErrors.privacyConsent && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.privacyConsent}
              </p>
            )}
            {labels.privacyNote && (
              <p className="mt-1.5 text-xs text-[#777777]">
                {labels.privacyNote}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-[#EB3113] py-3 text-center text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? labels.submitting : labels.submitButton}
          </button>
        </form>
      )}
    </div>
  );
}
