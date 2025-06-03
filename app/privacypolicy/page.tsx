import { ArrowLeft, Shield, Eye, Cookie, Users, Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Privacy Policy
                </h1>
                <p className="text-gray-600 mt-1">Welcome to Feynman AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Introduction */}
            <section className="mb-12">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  We care about your privacy and want to make sure you
                  understand how we handle your information when using our app.
                  Below, we explain what information we collect, how we use it,
                  and the choices you have regarding your data.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Who We Are
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  NoteSnap is powered by NoteSnap, LLC, a self-funded company
                  focused on providing you with a smooth, reliable note-taking
                  experience.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Information We Collect
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🎵 Audio Recordings and Files
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We store any audio recordings and files you upload, so you
                    can easily access or download them whenever needed.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📊 App Stats and Analytics
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To keep NoteSnap running efficiently, we collect minimal
                    data such as the number of notes you create. We use
                    third-party services to manage and analyze this data.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    👤 User Data
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We collect user data such as email, name, and profile
                    picture. This data is used to personalize your experience
                    and is not shared with third parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies and Technologies */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Cookie className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Cookies and Other Technologies
                </h2>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  At NoteSnap, we prioritize your privacy and don't rely on
                  third-party "cookies" or similar tracking technologies, like
                  web beacons, across our website, services, or apps. However,
                  we do use some in-house cookies to improve functionality and
                  your overall experience:
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Communications Cookies
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      These help ensure data flows smoothly across our platform
                      and assist in identifying and fixing any errors.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Essential Cookies
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      These are vital for the features and services you use,
                      such as language preferences or transaction verification.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Analytical Cookies
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      We use these to understand how you interact with our
                      services, helping us optimize and improve them.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Opting Out
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you'd prefer not to use cookies, you can disable them in
                    your browser settings by selecting "Block all cookies." Keep
                    in mind, disabling cookies might affect certain features on
                    our website and app.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Beyond Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may occasionally use "click-through URLs" in our emails
                    to link you to specific content on our site. When you click
                    these links, it briefly passes through our server, helping
                    us measure engagement. If you'd rather avoid this, simply
                    avoid clicking links in our emails.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Most of the data we collect through cookies is non-personal.
                    If local laws treat things like IP addresses as personal
                    data, we apply the same protections to them as we would with
                    other personal information.
                  </p>
                </div>
              </div>
            </section>

            {/* Third-Party Partners */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Third-Party Partners
                </h2>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                We rely on a few trusted third-party services to help manage and
                enhance our app:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Polar</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Subscription and payment management
                  </p>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                  >
                    View Privacy Policy →
                  </a>
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-4 italic">
                These services may collect or process some of your data, so
                please refer to their policies for more details.
              </p>
            </section>

            {/* Advertising and Rights */}
            <section className="mb-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-pink-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Advertising Practices
                    </h2>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed">
                      Any advertisements shown through our own platform while
                      using NoteSnap are designed to respect your privacy. These
                      ads don't track or share your personal information.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Rights
                    </h2>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Delete Your Data
                        </h4>
                        <p className="text-gray-700 text-sm">
                          You have the right to request the permanent deletion
                          of your information from our system at any time.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Contact Us
                        </h4>
                        <p className="text-gray-700 text-sm">
                          If you have any questions or need help, feel free to
                          email us at support@notesnap.app.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  For further questions or support, you can reach us at:
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">
                    support@notesnap.app
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mt-6">
                <p className="text-gray-700 leading-relaxed text-center">
                  Thank you for choosing NoteSnap! We're here to support you on
                  your note-taking journey.
                </p>
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
              </div>
              <Link
                href="/terms-of-service"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Terms of Use →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
