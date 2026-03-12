import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
  MapPin, 
  ClipboardList, 
  Truck, 
  ChevronRight, 
  AlertCircle, 
  Loader2,
  FileText,
  CheckCircle2,
  Info,
  Settings2,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateConstructionPlan } from './services/geminiService';
import { PROJECT_TYPES, ProjectType } from './constants';

interface CodeRequirement {
  category: string;
  requirement: string;
  source: string;
}

interface MaterialItem {
  item: string;
  specification: string;
  quantity: string;
  unit: string;
  note: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface ConstructionPlan {
  projectName: string;
  locationInfo: string;
  buildingCodes: CodeRequirement[];
  materialBudget: MaterialItem[];
  constructionProcess: ProcessStep[];
  proTips: string[];
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ConstructionPlan | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(PROJECT_TYPES[0].id);
  const [address, setAddress] = useState('');
  const [detail, setDetail] = useState('');
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});

  const selectedType = PROJECT_TYPES.find(t => t.id === selectedTypeId) || PROJECT_TYPES[0];

  useEffect(() => {
    // Reset dynamic values when type changes
    const initialValues: Record<string, string> = {};
    selectedType.fields.forEach(f => {
      initialValues[f.id] = '';
    });
    setDynamicValues(initialValues);
  }, [selectedTypeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        typeLabel: selectedType.label,
        address,
        dynamicFields: dynamicValues,
        detail
      };
      const result = await generateConstructionPlan(payload);
      setPlan(result);
    } catch (error) {
      alert('生成计划时出错，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleDynamicChange = (fieldId: string, value: string) => {
    setDynamicValues(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xl">
              <Hammer size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ProBuild Architect</h1>
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Professional Construction Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-black/40">
              <Settings2 size={14} />
              IRC / IBC / UPC COMPLIANT
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[450px_1fr] gap-12">
          {/* Input Section */}
          <section>
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 sticky top-28">
              <div className="flex items-center gap-2 mb-8">
                <LayoutDashboard size={20} className="text-emerald-600" />
                <h2 className="text-2xl font-serif italic">项目参数配置</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/40 mb-2">项目类型 (Standardized Type)</label>
                  <select 
                    value={selectedTypeId}
                    onChange={e => setSelectedTypeId(e.target.value)}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none font-medium"
                  >
                    {PROJECT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/40 mb-2">项目地址 (Exact Address)</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                    <input 
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="1495 Jameson Ct, 15101"
                      className="w-full bg-[#F3F4F6] border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-black/30 italic">系统将按 Township → County → State 顺序检索规范</p>
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-4 pt-4 border-t border-black/5">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">必填技术参数</h3>
                  {selectedType.fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-[11px] font-bold text-black/60 mb-1.5">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={dynamicValues[field.id] || ''}
                          onChange={e => handleDynamicChange(field.id, e.target.value)}
                          className="w-full bg-[#F3F4F6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                        >
                          <option value="">请选择...</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="relative">
                          <input
                            type={field.type}
                            required={field.required}
                            value={dynamicValues[field.id] || ''}
                            onChange={e => handleDynamicChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full bg-[#F3F4F6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                          />
                          {field.unit && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-black/30 uppercase">
                              {field.unit}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/40 mb-2">补充说明 (Additional Details)</label>
                  <textarea 
                    rows={4}
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                    placeholder="例如: 需要包含一个 niche, 更换排气扇等..."
                    className="w-full bg-[#F3F4F6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                  {loading ? '正在检索层级规范...' : '生成专业施工方案'}
                </button>
              </form>
            </div>
          </section>

          {/* Output Section */}
          <section className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {!plan && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-black/5 rounded-[40px] bg-white/50"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-black/5">
                    <FileText size={32} className="text-black/10" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-2">等待参数输入</h3>
                  <p className="text-black/40 max-w-xs text-sm">选择项目类型并填写必要的技术参数，系统将为您构建完整的工程文档。</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12"
                >
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-black/5 border-t-black rounded-full animate-spin" />
                    <Hammer className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black" size={32} />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold tracking-tight">正在构建工程方案</p>
                    <p className="text-xs text-black/40 font-mono animate-pulse uppercase tracking-widest">Searching Township Codes... Calculating Materials...</p>
                  </div>
                </motion.div>
              )}

              {plan && !loading && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Summary Header */}
                  <div className="bg-white rounded-[40px] p-10 shadow-sm border border-black/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/50 to-transparent" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-emerald-600 mb-4">
                        <CheckCircle2 size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Document Generated</span>
                      </div>
                      <h2 className="text-4xl font-serif italic mb-4">{plan.projectName}</h2>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold">
                          <MapPin size={12} />
                          {plan.locationInfo}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Building Codes */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                          <AlertCircle size={20} />
                        </div>
                        <h3 className="text-xl font-bold">层级规范要求</h3>
                      </div>
                      <div className="space-y-4">
                        {plan.buildingCodes.map((code, i) => (
                          <div key={i} className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50 group hover:bg-amber-50/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700/60">{code.category}</span>
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-md font-mono">{code.source}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-amber-900/80">{code.requirement}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-zinc-900 text-white rounded-[32px] p-8 shadow-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                          <Info size={20} />
                        </div>
                        <h3 className="text-xl font-bold">专家建议 (Pro Tips)</h3>
                      </div>
                      <ul className="space-y-4">
                        {plan.proTips.map((tip, i) => (
                          <li key={i} className="flex gap-4 text-sm text-zinc-400 leading-relaxed">
                            <span className="text-emerald-500 font-bold">0{i+1}</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Material Budget */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <ClipboardList size={20} />
                      </div>
                      <h3 className="text-xl font-bold">材料清单 (含 10% 损耗)</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black/5">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">材料名称</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">规格</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">数量</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">用途/备注</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                          {plan.materialBudget.map((item, i) => (
                            <tr key={i} className="hover:bg-black/[0.01] transition-colors">
                              <td className="px-6 py-4 font-bold text-sm">{item.item}</td>
                              <td className="px-6 py-4 text-xs text-black/60 font-mono">{item.specification}</td>
                              <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{item.quantity} {item.unit}</td>
                              <td className="px-6 py-4 text-xs text-black/40 italic">{item.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Construction Process */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-12">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Truck size={20} />
                      </div>
                      <h3 className="text-xl font-bold">施工流程明细 (Construction Flow)</h3>
                    </div>
                    <div className="grid gap-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-black/5">
                      {plan.constructionProcess.map((step, i) => (
                        <div key={i} className="relative pl-16 group">
                          <div className="absolute left-0 top-0 w-12 h-12 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm z-10 group-hover:bg-black group-hover:text-white transition-all">
                            {step.step < 10 ? `0${step.step}` : step.step}
                          </div>
                          <h4 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h4>
                          <p className="text-sm text-black/60 leading-relaxed max-w-2xl">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
