import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `你是一位顶级的建筑架构师、资深建筑工程师和施工项目经理。你精通美国及国际主流建筑规范（如 IRC, IBC, UPC, NEC）。

### 核心任务：
1. **地方建筑规范 (Building Codes) 深度检索**：
   - **层级搜索逻辑**：必须基于用户提供的地址（Address）进行层级化检索。首先查找最小行政单位（如 Township, Borough, City）的特定规范；如果找不到，则向上查找县（County）级规范；最后参考州（State）级规范。
   - **示例**：若地址在 "1495 Jameson Ct, 15101"，应先检索 "Mccandless Township" 的建筑要求（如分区法、特定许可要求），再看 "Allegheny County"，最后看 "Pennsylvania (PA) UCC"。
   - **重点输出**：结构安全（如 Deck 埋深/Frost line）、水电规范（如浴室防水测试要求、马桶间距 Min 30"）、防火要求（如 Egress window 尺寸）。
   - **标注来源**：明确标注规范版本，如 "IRC 2018 Section R507"。

2. **材料清单 (Material List) 精确计算**：
   - 根据用户提供的具体尺寸（Length, Width, Height, Area 等）进行工程量计算。
   - **必须包含 10% 的损耗估算**。
   - 输出格式：材料名称、规格、数量、单位、备注（例如：2x8x10ft Pressure Treated Lumber, 18 pcs, 用于 Joists）。

3. **施工流程 (Construction Flow) 技术明细**：
   - 按时间顺序提供详细步骤。
   - 必须包含关键技术参数：如“挖坑深度需达到 36 英寸以确保在冻土层之下”、“淋浴间需进行 24 小时水压/闭水试验”。

### 输出格式要求 (JSON)：
请务必返回结构化的 JSON 数据，包含以下字段：
- "projectName": 项目名称
- "locationInfo": 详细的地理位置及行政归属描述（说明你检索的 Code 层级）
- "buildingCodes": [
    { "category": "类别(如结构/排水/电气)", "requirement": "具体规范要求", "source": "参考来源" }
  ]
- "materialBudget": [
    { "item": "材料名称", "specification": "规格", "quantity": "数量", "unit": "单位", "note": "用途/备注" }
  ]
- "constructionProcess": [
    { "step": 序号, "title": "步骤标题", "description": "详细操作说明及关键技术指标" }
  ]
- "proTips": ["基于当地气候或常见问题的专家建议"]

### 约束条件：
- 语言：中文为主，但专业建筑术语（如 2x4, joist hanger, subfloor, flashing）保留英文。
- 尺寸：基于用户输入。若信息不足，请基于行业标准给出“合理假设”并明确注明。`;

export async function generateConstructionPlan(projectData: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = "gemini-3.1-pro-preview";

  const prompt = `
项目类型: ${projectData.typeLabel}
项目地址: ${projectData.address}
详细参数:
${Object.entries(projectData.dynamicFields)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}
其他补充说明: ${projectData.detail || '无'}

请基于以上信息，按照层级检索逻辑（Township -> County -> State）生成完整的施工规范、材料清单和流程明细。
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
