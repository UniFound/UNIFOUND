import { UploadCloud, Cpu, CheckCircle, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Report Your Item",
      desc: "Upload details and images of what you lost or found. Our system logs it into the university's central database immediately.",
      icon: <UploadCloud className="w-6 h-6" />,
      theme: "from-blue-500 to-blue-600"
    },
    {
      id: "02",
      title: "AI Smart Matching",
      desc: "Our neural matching engine cross-references categories, locations, and visual descriptions to find your item's twin in seconds.",
      icon: <Cpu className="w-6 h-6" />,
      theme: "from-indigo-500 to-indigo-600"
    },
    {
      id: "03",
      title: "Verified Recovery",
      desc: "Submit proof of ownership through our secure claim portal and coordinate a safe handover with campus authorities.",
      icon: <CheckCircle className="w-6 h-6" />,
      theme: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <section className="relative py-32 bg-blue-50 overflow-hidden">
      {/* Decorative Side Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Process Flow</span>
            </div>
            
            <h2 className="text-5xl font-[1000] text-slate-900 tracking-tighter leading-tight mb-8">
              Three simple steps to <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">reunite with your items.</span>
            </h2>

            <div className="space-y-12 relative">
              {/* Vertical Connector Line */}
              <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-slate-100 -z-10" />

              {steps.map((step, index) => (
                <div key={index} className="group flex gap-8">
                  {/* Step Number/Icon */}
                  <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.theme} text-white flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-500`}>
                    {step.icon}
                  </div>
                  
                  {/* Step Text */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{step.id}</span>
                       <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-12 flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-widest group">
              Start Reporting Now 
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* RIGHT VISUAL - (Mockup Area) */}
          <div className="relative">
             <div className="relative z-10 bg-white rounded-[40px] border border-slate-100 shadow-2xl p-4 transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
                {/* Simulated UI Window */}
                <div className="bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 aspect-[4/3] relative">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                         <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
                            <Cpu size={40} className="text-blue-600 animate-pulse" />
                         </div>
                         <h4 className="text-lg font-black text-slate-900 mb-2 tracking-tight">AI Matching in Progress...</h4>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comparing 1,200+ database entries</p>
                      </div>
                   </div>

                   {/* Floating UI Elements */}
                   <div className="absolute top-8 right-8 bg-white p-3 rounded-2xl shadow-xl border border-slate-50 animate-bounce transition-all">
                      <CheckCircle className="text-emerald-500" />
                   </div>
                   <div className="absolute bottom-8 left-8 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">89%</div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Match Score</span>
                   </div>
                </div>
             </div>

             {/* Background Decoration for the Mockup */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/50 rounded-full blur-[100px] -z-20" />
          </div>

        </div>
      </div>
    </section>
  );
}