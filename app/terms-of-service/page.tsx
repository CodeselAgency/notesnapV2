import {
  ArrowLeft,
  Shield,
  FileText,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Terms of Use
                </h1>
                <p className="text-gray-600 mt-1">
                  Last updated September 9, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Recording and Content Policy */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recording and Content Policy
                </h2>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  At NoteSnap, we prioritize legal and ethical use of our
                  platform. Users are expected to follow the policies below to
                  ensure compliance with institutional rules, copyright laws,
                  and privacy regulations:
                </p>

                <div className="space-y-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      Compliance with Institutional Policies
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Users are solely responsible for ensuring that any
                      material they upload, record, or convert using NoteSnap
                      aligns with the policies of their school, university,
                      workplace, or instructor. Please review your institution's
                      guidelines before using NoteSnap to record or transform
                      educational content.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      Copyright Respect
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Do not upload or convert documents protected by copyright
                      unless you have explicit permission from the copyright
                      owner. This includes textbooks, slides, handouts, and
                      multimedia materials. Users are fully responsible for
                      verifying content ownership and rights before using our
                      services.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      Privacy and Confidentiality
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      NoteSnap must not be used to process, share, or store
                      private, confidential, or sensitive information protected
                      under U.S. privacy laws (or other applicable
                      jurisdictions). Unauthorized use of NoteSnap for recording
                      or sharing private conversations, identifiable personal
                      data, or confidential documents is strictly prohibited.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">
                        Important Disclaimer
                      </h4>
                      <p className="text-red-800 text-sm leading-relaxed">
                        NoteSnap is not liable for content uploaded by users
                        that infringes on institutional rules, copyright law, or
                        privacy protections. Users assume full responsibility
                        for ensuring their actions on the platform are compliant
                        with all applicable laws and regulations.
                      </p>
                      <p className="text-red-800 text-sm leading-relaxed mt-3">
                        By using NoteSnap, you agree to indemnify and hold
                        NoteSnap and its team harmless from any legal
                        consequences arising from the misuse or unauthorized
                        distribution of protected material.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* License to Use */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  License to Use NoteSnap
                </h2>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  As long as you comply with these Terms of Use, NoteSnap grants
                  you a limited, personal, non-exclusive, non-transferable,
                  non-commercial, and revocable license to access and use the
                  platform solely for educational and personal use.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    You agree not to:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700">
                        Copy, record, or reproduce platform content for
                        commercial use
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700">
                        Access NoteSnap using bots, scrapers, or other automated
                        tools unless explicitly authorized in writing
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700">
                        Share login credentials or access to paid features with
                        others
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-700 leading-relaxed mt-6">
                  Subscription plans are intended for individual users only. We
                  may enforce limits to prevent abuse, including device
                  restrictions, content access thresholds, or session limits.
                </p>
              </div>
            </section>

            {/* Refund Policy */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Refund Policy
                </h2>
              </div>

              <div className="space-y-8">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    1. Eligibility
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may request a refund under the following conditions:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700">
                        Your request is within 30 days of the initial
                        subscription or renewal date
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700">
                        Your usage did not violate our Terms of Use or involve
                        excessive consumption
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700">
                        You experienced technical issues with NoteSnap that were
                        reported and could not be resolved promptly
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700">
                        You made an accidental or duplicate payment
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      2. No Refunds for Inactivity
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Refunds are not provided for unused, inactive, or
                      forgotten subscriptions. Users are responsible for
                      managing their billing and canceling subscriptions before
                      renewal.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      3. How to Request a Refund
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      To submit a refund request:
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Email us at{" "}
                      <span className="font-medium text-blue-600">
                        support@notesnap.app
                      </span>{" "}
                      with the subject line "Refund Request." Include your full
                      name, email address, subscription details, and a brief
                      explanation.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        4. Pro-Rated Refunds
                      </h4>
                      <p className="text-gray-700 text-sm">
                        If you cancel during an active billing period, you may
                        be eligible for a pro-rated refund based on unused time.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        6. Processing Time
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Once approved, refunds will be issued to your original
                        payment method within 7–14 business days.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        7. Policy Updates
                      </h4>
                      <p className="text-gray-700 text-sm">
                        NoteSnap reserves the right to revise this policy at any
                        time with proper notification.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5. Non-Refundable Scenarios
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700 text-sm">
                        Requests made more than 30 days after purchase
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700 text-sm">
                        Subscription charges tied to promotional offers or
                        special discounts
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700 text-sm">
                        Monthly subscription renewals after the first 30 days
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-gray-700 text-sm">
                        Accounts terminated for violating our Terms of Use
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 lg:px-12 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  Build with ❤️ by the{" "}
                  <span className="font-medium">NoteSnap Team</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Helping you turn documents into knowledge. Effective July 29,
                  2024
                </p>
              </div>
              <Link
                href="/privacypolicy"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
