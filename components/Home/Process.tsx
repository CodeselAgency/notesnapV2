import Image from "next/image";

export default function Process() {
    return (
        <section className="bg-white py-12 md:py-16 flex flex-col items-center justify-center w-full">
            <h2 className="text-7xl font-roboto font-semibold text-center mb-8">How it works</h2>
            <div className="container mx-auto px-4 max-w-6xl">
                {/* First Row - 60/40 split */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Create Account Card - 60% width */}
                    <div className="w-full md:w-[60%] bg-white rounded-xl p-2 border border-gray-200 flex flex-col">
                        <div className="relative h-[280px] w-full bg-gray-50 rounded-lg overflow-hidden">
                            <Image 
                                src="/images/bento-1.png" 
                                fill
                                alt="Create Account" 
                                className="object-contain p-3"
                                sizes="(max-width: 768px) 100vw, 60vw"
                            />
                        </div>
                        <div className="p-3 flex flex-col mt-1">
                            <h3 className="text-lg font-inter-tight font-medium text-[#1a1a1a]">Create Your Account</h3>
                            <p className="text-sm text-[#666] mt-1 font-inter-tight font-normal opacity-80">
                                Seamlessly sign up with Google and set up your personalized workspace.
                            </p>
                        </div>
                    </div>

                    {/* Upload PDF Card - 40% width */}
                    <div className="w-full md:w-[40%] bg-white rounded-xl p-2 border border-gray-200 flex flex-col">
                        <div className="relative h-[280px] w-full bg-gray-50 rounded-lg overflow-hidden">
                            <Image 
                                src="/images/bento-2.png" 
                                fill
                                alt="Upload PDF" 
                                className="object-contain p-3"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                        <div className="p-3 flex flex-col mt-1">
                            <h3 className="text-lg font-inter-tight font-medium text-[#1a1a1a]">Upload the PDF</h3>
                            <p className="text-sm text-[#666] mt-1 font-inter-tight font-normal opacity-80">
                                Easily upload your documents in PDF format for instant access.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Second Row - 45/55 split */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Get Everything Card - 45% width */}
                    <div className="w-full md:w-[45%] bg-white rounded-xl p-2 border border-gray-200 flex flex-col">
                        <div className="relative h-[280px] w-full bg-gray-50 rounded-lg overflow-hidden">
                            <Image 
                                src="/images/bento-3.png" 
                                fill
                                alt="PDF Analysis" 
                                className="object-contain p-3"
                                sizes="(max-width: 768px) 100vw, 45vw"
                            />
                        </div>
                        <div className="p-3 flex flex-col mt-1">
                            <h3 className="text-lg font-inter-tight font-medium text-[#1a1a1a]">Get Everything from the PDFs</h3>
                            <p className="text-sm text-[#666] mt-1 font-inter-tight font-normal opacity-80">
                                Unlock deep insights from your PDFs through multiple smart analysis modes.
                            </p>
                        </div>
                    </div>

                    {/* Transfer to Notion Card - 55% width */}
                    <div className="w-full md:w-[55%] bg-white rounded-xl p-2 border border-gray-200 flex flex-col">
                        <div className="relative h-[280px] w-full bg-gray-50 rounded-lg overflow-hidden">
                            <Image 
                                src="/images/bento-4.png" 
                                fill
                                alt="Transfer to Notion" 
                                className="object-contain p-3"
                                sizes="(max-width: 768px) 100vw, 55vw"
                            />
                        </div>
                        <div className="p-3 flex flex-col mt-1">
                            <h3 className="text-lg font-inter-tight font-medium text-[#1a1a1a]">Transfer Insights to Notion</h3>
                            <p className="text-sm text-[#666] mt-1 font-inter-tight font-normal opacity-80">
                                Transfer all your results to Notion with a single click for effortless organization.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}