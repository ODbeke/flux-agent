"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Layers,
  Fingerprint,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-montserrat overflow-hidden hero-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-10 bg-transparent">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-museo font-extrabold text-5xl tracking-tighter text-[#4A6FA5]">FLUX</span>
          </div>
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-3 bg-[#0f172a] text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-[#4A6FA5] hover:scale-110 transition-all duration-300 shadow-xl"
          >
            Launch App <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="animate-reveal [animation-delay:400ms] opacity-0 font-poppins text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 max-w-4xl leading-[1.1]">
          Synthesize <span className="text-[#4A6FA5]">Intelligence.</span> <br/>
          Secure the <span className="text-gray-300">Truth.</span>
        </h1>
        
        <p className="animate-reveal [animation-delay:600ms] opacity-0 text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
          The ultimate synthesis layer for verifiable AI research. Generate insights with 0G Compute, archive permanently on 0G Storage, and own your intellectual capital.
        </p>

        <div className="animate-reveal [animation-delay:800ms] opacity-0 flex flex-col sm:flex-row items-center gap-6">
          <a 
            href="https://docs.0g.ai" 
            target="_blank" 
            className="w-full sm:w-auto px-10 py-4 bg-white text-gray-400 border border-gray-100 rounded-full font-semibold text-base hover:bg-gray-50 hover:text-[#4A6FA5] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Read Documentation
          </a>
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-14 py-6 rounded-full font-bold text-2xl glossy-btn text-white animate-heartbeat hover:scale-110 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
          >
            Get Started <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

      </section>

      {/* Protocol Flow Sequence */}
      <section id="how-it-works" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-poppins text-4xl md:text-5xl font-bold mb-6">Verifiable Lifecycle</h2>
            <p className="text-gray-600 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Four pillars of decentralized intellectual capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4A6FA5]/20 to-transparent -translate-y-1/2 z-0" />
            
            {[
              { 
                icon: <Cpu />, 
                title: "Generation", 
                desc: "High-performance AI inference via 0G decentralized compute network.",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                icon: <Database />, 
                title: "Storage", 
                desc: "Immutable, permanent archival on the ZeroGravity storage mesh.",
                color: "bg-purple-50 text-purple-600"
              },
              { 
                icon: <ShieldCheck />, 
                title: "Verification", 
                desc: "Cryptographic anchoring on the 0G Chainscan EVM layer.",
                color: "bg-cyan-50 text-cyan-600"
              },
              { 
                icon: <Fingerprint />, 
                title: "Ownership", 
                desc: "Unique Agent ID issuance proving your research provenance.",
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((step, idx) => (
              <div key={idx} className="luxury-card p-8 rounded-2xl relative z-10 bg-white">
                <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-6`}>
                  {React.cloneElement(step.icon as React.ReactElement<any>, { className: "w-7 h-7" })}
                </div>
                <h3 className="font-poppins font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-[#0f172a] rounded-[2rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A6FA5] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-[120px] opacity-10 -translate-x-1/2 translate-y-1/2" />
          
          <h2 className="font-poppins text-4xl md:text-6xl font-bold mb-8 relative z-10 leading-tight">
            Ready to secure your <br/> digital intellect?
          </h2>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0f172a] rounded-2xl font-bold text-xl hover:scale-105 transition-all relative z-10"
          >
            Launch Flux Agent <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-8 text-gray-400 text-sm relative z-10">
            Join the decentralized research revolution. Powered by 0G Network.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-museo font-extrabold text-2xl tracking-tighter text-[#4A6FA5]">FLUX</span>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 Flux Agent. Built for the 0G Aristotle Mainnet.
          </p>
        </div>
      </footer>
    </div>
  );
}
