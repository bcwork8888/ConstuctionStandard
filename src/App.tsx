import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateConstructionPlan } from './services/geminiService';

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
  const [formData, setFormData] = useState({
    type: '',
    address: '',
    location: '',
    detail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateConstructionPlan(formData);
      setPlan(result);
    } catch (error) {
      alert('生成计划时出错，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (example: number) => {
    if (example === 1) {
      setFormData({
        type: 'Deck',
        address: 'PA, 15101',
        location: 'backyard, next to back of house',
        detail: 'a 12ft by 14ft attached wood deck on back yard. 14 ft side attached to existing house. Deck board is 36 inch above ground, a 3ft wide stair on top left corner to ground level. Use wood frame and composite deck board and railing, PVC surface board on side to make it look more model and luxury'
      });
    } else {
      setFormData({
        type: 'Master Bathroom Remodel',
        address: 'PA, 15206',
        location: 'second floor master bathroom',
        detail: 'update 10ft by 8ft master bathroom, keep all rough-in pipe. re-tile the floor, update tub to shower with shower enclosure, retile whole shower area (3ft by 5ft 3 walls) with a niche. replace exhaust fan, light fixture, toilet, and vanity.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Hammer size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ProBuild Planner</h1>
              <p className="text-xs text-black/40 font-medium uppercase tracking-widest">Construction AI Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-4">
            <button onClick={() => handleExample(1)} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">范例: Deck</button>
            <button onClick={() => handleExample(2)} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">范例: Bathroom</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[400px_1fr] gap-12">
          {/* Input Section */}
          <section>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 sticky top-28">
              <h2 className="text-2xl font-serif italic mb-6">项目详情录入</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/40 mb-2">项目类型</label>
                  <input 
                    required
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    placeholder="例如: Deck, Bathroom Remodel"
                    className="w-full bg-[#F9F9F7] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/40 mb-2">项目地址</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                    <input 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="PA, 15101"
                      className="w-full bg-[#F9F9F7] border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/40 mb-2">具体位置</label>
                  <input 
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="例如: Backyard, 2nd Floor"
                    className="w-full bg-[#F9F9F7] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/40 mb-2">详细描述</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.detail}
                    onChange={e => setFormData({...formData, detail: e.target.value})}
                    placeholder="描述尺寸、材料偏好、特殊要求..."
                    className="w-full bg-[#F9F9F7] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />}
                  {loading ? '正在生成专业方案...' : '生成施工方案 & 预算'}
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
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-black/5 rounded-[40px]"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <FileText size={32} className="text-black/10" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-2">准备好开始了吗？</h3>
                  <p className="text-black/40 max-w-xs">输入您的项目详情，AI 将为您生成符合当地规范的施工图景、材料清单和步骤说明。</p>
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
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    <Hammer className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" size={32} />
                  </div>
                  <p className="mt-8 text-lg font-medium text-emerald-800 animate-pulse">正在检索当地建筑规范并计算材料...</p>
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
                  <div className="bg-emerald-900 text-white rounded-[40px] p-10 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/50 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-emerald-400 mb-4">
                        <CheckCircle2 size={18} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">方案已生成</span>
                      </div>
                      <h2 className="text-4xl font-serif italic mb-2">{plan.projectName}</h2>
                      <p className="text-emerald-100/60 flex items-center gap-2">
                        <MapPin size={14} />
                        {plan.locationInfo}
                      </p>
                    </div>
                  </div>

                  {/* Building Codes */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <AlertCircle size={20} />
                      </div>
                      <h3 className="text-xl font-bold">地方建筑规范要求</h3>
                    </div>
                    <div className="grid gap-4">
                      {plan.buildingCodes.map((code, i) => (
                        <div key={i} className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700/60">{code.category}</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-md font-mono">{code.source}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-amber-900/80">{code.requirement}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material Budget */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <ClipboardList size={20} />
                      </div>
                      <h3 className="text-xl font-bold">材料清单 & 预算估算</h3>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-black/5">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-black/5">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">材料名称</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">规格</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">数量</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">备注</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                          {plan.materialBudget.map((item, i) => (
                            <tr key={i} className="hover:bg-black/[0.02] transition-colors">
                              <td className="px-6 py-4 font-medium">{item.item}</td>
                              <td className="px-6 py-4 text-sm text-black/60">{item.specification}</td>
                              <td className="px-6 py-4 font-mono text-emerald-600">{item.quantity} {item.unit}</td>
                              <td className="px-6 py-4 text-xs text-black/40">{item.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Construction Process */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Truck size={20} />
                      </div>
                      <h3 className="text-xl font-bold">施工流程明细</h3>
                    </div>
                    <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-black/5">
                      {plan.constructionProcess.map((step, i) => (
                        <div key={i} className="relative pl-12">
                          <div className="absolute left-0 top-0 w-10 h-10 bg-white border border-black/5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10">
                            {step.step}
                          </div>
                          <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                          <p className="text-sm text-black/60 leading-relaxed">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tips */}
                  {plan.proTips && (
                    <div className="bg-indigo-50 rounded-[32px] p-8 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-4 text-indigo-900">
                        <Info size={20} />
                        <h3 className="font-bold">专家建议</h3>
                      </div>
                      <ul className="space-y-3">
                        {plan.proTips.map((tip, i) => (
                          <li key={i} className="flex gap-3 text-sm text-indigo-900/70">
                            <span className="text-indigo-400">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
