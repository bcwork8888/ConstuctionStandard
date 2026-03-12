export interface ProjectField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  unit?: string;
}

export interface ProjectType {
  id: string;
  label: string;
  fields: ProjectField[];
}

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'deck',
    label: '阳台/露台 (Deck)',
    fields: [
      { id: 'length', label: '长度 (Length)', type: 'number', unit: 'ft', required: true },
      { id: 'width', label: '宽度 (Width)', type: 'number', unit: 'ft', required: true },
      { id: 'height', label: '离地高度 (Height above ground)', type: 'number', unit: 'inch', required: true },
      { id: 'material', label: '主要材料 (Material)', type: 'select', options: ['Pressure Treated Wood', 'Cedar', 'Composite (Trex/Azek)', 'Ipe'], required: true },
      { id: 'railing', label: '护栏类型 (Railing)', type: 'select', options: ['Wood', 'Aluminum', 'Glass', 'Cable'], required: true },
      { id: 'attachment', label: '连接方式 (Attachment)', type: 'select', options: ['Attached to house', 'Free-standing'], required: true }
    ]
  },
  {
    id: 'bathroom',
    label: '卫生间改造 (Bathroom Remodel)',
    fields: [
      { id: 'dimensions', label: '空间尺寸 (Dimensions)', type: 'text', placeholder: '例如: 10ft x 8ft', required: true },
      { id: 'shower_type', label: '淋浴/浴缸 (Shower/Tub)', type: 'select', options: ['Tub only', 'Shower only', 'Tub to Shower conversion', 'Both'], required: true },
      { id: 'tile_area', label: '铺砖面积 (Tile Area)', type: 'text', placeholder: '墙面及地面估算', required: true },
      { id: 'fixtures', label: '更换项目 (Fixtures)', type: 'text', placeholder: '例如: Vanity, Toilet, Fan', required: true }
    ]
  },
  {
    id: 'kitchen',
    label: '厨房改造 (Kitchen Remodel)',
    fields: [
      { id: 'layout', label: '布局 (Layout)', type: 'select', options: ['L-Shape', 'U-Shape', 'Galley', 'Island'], required: true },
      { id: 'cabinets', label: '橱柜数量 (Cabinets)', type: 'number', unit: 'linear ft', required: true },
      { id: 'countertop', label: '台面材料 (Countertop)', type: 'select', options: ['Quartz', 'Granite', 'Marble', 'Laminate'], required: true },
      { id: 'appliances', label: '电器更换', type: 'text', placeholder: '哪些电器需要重新布线/布管' }
    ]
  },
  {
    id: 'concrete',
    label: '水泥地坪 (Concrete Slab/Patio)',
    fields: [
      { id: 'area', label: '面积 (Area)', type: 'text', placeholder: '例如: 20ft x 20ft', required: true },
      { id: 'thickness', label: '厚度 (Thickness)', type: 'number', unit: 'inch', required: true, placeholder: '通常 4" 或 6"' },
      { id: 'finish', label: '表面处理 (Finish)', type: 'select', options: ['Broom Finish', 'Stamped', 'Exposed Aggregate', 'Polished'], required: true }
    ]
  },
  {
    id: 'basement',
    label: '地下室装修 (Basement Finishing)',
    fields: [
      { id: 'area', label: '装修面积 (Total Area)', type: 'number', unit: 'sqft', required: true },
      { id: 'rooms', label: '房间划分', type: 'text', placeholder: '例如: 1 Bedroom, 1 Bath, 1 Living' },
      { id: 'egress', label: '逃生窗 (Egress Window)', type: 'select', options: ['Existing', 'Need to install', 'N/A'], required: true }
    ]
  },
  {
    id: 'roofing',
    label: '屋顶更换 (Roofing)',
    fields: [
      { id: 'squares', label: '屋顶面积 (Squares)', type: 'number', unit: 'sq (100 sqft)', required: true },
      { id: 'material', label: '瓦片类型', type: 'select', options: ['Asphalt Shingle', 'Metal', 'Slate', 'Tile'], required: true },
      { id: 'layers', label: '拆除层数', type: 'number', placeholder: '1 or 2' }
    ]
  }
];
