import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Clock, Database, CheckCircle2, AlertTriangle, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 pt-10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
            <motion.div 
               animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }} 
               transition={{ duration: 8, repeat: Infinity }}
               className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" 
            />
            <motion.div 
               animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }} 
               transition={{ duration: 10, repeat: Infinity, delay: 2 }}
               className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" 
            />
            {/* Horizontal Scan Line */}
            <motion.div 
               animate={{ top: ['0%', '100%'], opacity: [0, 0.5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent w-full z-0"
            />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 relative z-10 group"
        >
          {/* Logo Container with Float */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
             <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/30 transition-all duration-700" />
             <img 
               src="/logo.png" 
               alt="ZeroLeak" 
               className="h-24 w-24 md:h-40 md:w-40 object-contain relative z-10 drop-shadow-[0_0_40px_rgba(14,165,233,0.5)]" 
             />
             {/* Ring Animation */}
             <motion.div 
                className="absolute inset-[-20%] border border-blue-500/20 rounded-full z-0"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
             />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl space-y-5 relative z-10"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Badge variant="security" className="mb-2 text-[10px] py-1 px-3 border-blue-500/30 bg-blue-500/10 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md">
              <Shield className="w-3 h-3 mr-2 inline-block" /> INSTITUTIONAL GRADE SECURITY
            </Badge>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient">Unbreakable</span> Standard <br />
            for Exam Security.
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Zero Trust. Zero Leaks. Powered by <span className="text-slate-200 font-semibold">AES-256</span>, <span className="text-slate-200 font-semibold">Shamir's Secret Sharing</span>, and <span className="text-slate-200 font-semibold">Ethereum Timelocks</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
            <Button 
              size="lg" 
              className="text-white text-base px-8 py-6 bg-blue-600 hover:bg-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] transition-all duration-300 rounded-full group"
              onClick={() => navigate('/login')}
            >
              Launch Console <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-6 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all rounded-full"
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
            >
                View Architecture
            </Button>
          </div>
        </motion.div>
      </section>



      {/* Interactive Flow Diagram */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Decentralized Workflow</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How ZeroLeak Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
             A cryptographic chain of custody ensuring no single human can access the paper before the exam time.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
           {/* Connecting Line */}
           <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 md:-translate-x-1/2" />

           <div className="space-y-12 md:space-y-24 relative">
              <FlowStep 
                 step="01" 
                 title="Client-Side Encryption" 
                 desc="Teacher uploads PDF. It is encrypted LOCALLY in the browser using AES-256. The original file never leaves the device."
                 icon={Lock}
                 align="left"
              />
              <FlowStep 
                 step="02" 
                 title="Distributed Storage" 
                 desc="The encrypted blob is sharded and distributed across IPFS nodes. No single server holds the complete file."
                 icon={Database}
                 align="right"
              />
              <FlowStep 
                 step="03" 
                 title="Key Splitting (SSS)" 
                 desc="The decryption key is split into shares using Shamir's Secret Sharing and distributed to Authority nodes."
                 icon={Shield}
                 align="left"
              />
              <FlowStep 
                 step="04" 
                 title="Smart Contract Timelock" 
                 desc="A smart contract locks the key reconstruction function until the precise exam timestamp."
                 icon={Clock}
                 align="right"
              />
              <FlowStep 
                 step="05" 
                 title="Just-in-Time Decryption" 
                 desc="At exam time, Exam Centers automatically reconstruct the key and decrypt the paper for printing."
                 icon={CheckCircle2}
                 align="left"
              />
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 max-w-3xl">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
         </div>
         <div className="space-y-4">
            <FAQItem 
              question="What happens if the internet goes down?" 
              answer="ZeroLeak nodes cache encrypted shards locally. As long as the key is reconstructed before the outage (during the unlock window), the paper can be accessed offline."
            />
            <FAQItem 
              question="Can the Admin leak the paper?" 
              answer="No. The paper key is split into shares. The Admin does not hold enough shares to reconstruct the key alone. The smart contract enforces this logic immutably."
            />
             <FAQItem 
              question="Is this compliant with government regulations?" 
              answer="Yes. ZeroLeak uses NIST-approved AES-256 encryption and provides an immutable, auditable blockchain trail for every interaction, exceeding standard compliance requirements."
            />
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-slate-500 text-sm">
         <div className="container mx-auto px-6">
            <img src="/logo.png" alt="ZeroLeak" className="h-10 w-10 object-contain mx-auto mb-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <p className="mb-4">&copy; 2024 ZeroLeak Decentralized Security. All rights reserved.</p>
            <div className="flex justify-center gap-6">
               <a href="#" className="hover:text-white transition-colors">Documentation</a>
               <a href="#" className="hover:text-white transition-colors">GitHub</a>
               <a href="#" className="hover:text-white transition-colors">Smart Contract</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FlowStep = ({ step, title, desc, icon: Icon, align }) => {
   const isLeft = align === 'left';
   return (
     <motion.div 
       initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
       whileInView={{ opacity: 1, x: 0 }}
       viewport={{ once: true, margin: "-100px" }}
       transition={{ duration: 0.6 }}
       className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse text-right'}`}
     >
        <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} pl-12 md:pl-0 pt-4 md:pt-0`}>
           <span className="text-blue-500 font-mono text-sm font-bold tracking-widest mb-2 block">{step}</span>
           <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
           <p className="text-slate-400 leading-relaxed">{desc}</p>
        </div>
        
        <div className="relative z-10 shrink-0">
           <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-blue-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Icon className="w-6 h-6 text-blue-400" />
           </div>
        </div>

        <div className="flex-1 hidden md:block" />
     </motion.div>
   );
};

const FAQItem = ({ question, answer }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <Card className={`border-slate-800 transition-all ${isOpen ? 'bg-slate-900/80' : 'bg-slate-900/30'}`}>
         <button 
            className="w-full p-6 text-left flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
         >
            <span className="font-semibold text-slate-200">{question}</span>
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
         </button>
         {isOpen && (
            <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 animate-in slide-in-from-top-2">
               {answer}
            </div>
         )}
      </Card>
   );
};

export default LandingPage;
