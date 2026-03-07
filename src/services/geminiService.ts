import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `你是一位资深的建筑工程师和施工项目经理。你的任务是根据用户提供的装修/施工项目信息，生成专业的施工规范、材料预算和施工流程。

### 核心任务：
1. **地方建筑规范 (Building Codes)**：基于用户提供的地址（Address），检索或引用当地政府（如PA, 15101对应的Allegheny County）的建筑规范要求。重点关注安全、结构、水电、间距等硬性指标。
2. **材料清单 (Material List)**：根据项目尺寸和规范要求，精确计算所需材料。包括规格、数量（如：2x8x10ft 压力处理木材 18根）。
3. **施工流程 (Construction Flow)**：提供详细的、按步骤进行的施工说明，包含关键的技术细节和检查点（如：挖坑深度、防水测试、平整度要求）。

### 输出格式要求 (JSON)：
请务必以 JSON 格式返回结果，包含以下字段：
- "projectName": 项目名称
- "locationInfo": 地理位置及环境描述
- "buildingCodes": [
    { "category": "类别(如结构/水电)", "requirement": "具体规范要求", "source": "参考来源(如IRC 2018)" }
  ]
- "materialBudget": [
    { "item": "材料名称", "specification": "规格", "quantity": "数量", "unit": "单位", "note": "备注" }
  ]
- "constructionProcess": [
    { "step": 步骤序号, "title": "步骤标题", "description": "详细操作说明及注意事项" }
  ]
- "proTips": ["专家建议1", "专家建议2"]

### 约束条件：
- 所有的尺寸计算必须基于用户提供的 Detail。
- 如果信息不足以进行精确计算，请给出合理的估算范围并注明假设条件。
- 语言使用中文，但专业术语（如木材规格 2x4）保留英文习惯。`;

export async function generateConstructionPlan(projectData: {
  type: string;
  address: string;
  location: string;
  detail: string;
}) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = "gemini-3.1-pro-preview";

  const prompt = `
项目类型: ${projectData.type}
项目地址: ${projectData.address}
具体位置: ${projectData.location}
项目详情: ${projectData.detail}

请基于以上信息生成完整的施工规范、材料清单和流程明细。
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }] // 启用搜索以获取更准确的地方规范
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
