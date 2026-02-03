# 合同数据处理与 HTML 报表生成系统

一个灵活的合同数据处理工具，支持数据获取、更新、批量处理，并可生成 HTML 报表导出。

## 功能特性

- 📊 **数据获取** - 支持从模拟数据源获取合同数据
- ✏️ **数据更新** - 支持单个和批量更新合同字段
- 🔧 **数据处理** - 提取、转换、计算、验证等多种数据处理操作
- 📄 **报表生成** - 生成美观的 HTML 表格报表
- 📥 **多格式导出** - 支持 HTML、CSV、Excel、JSON、XML 格式
- 🎨 **样式定制** - 可自定义表格样式和布局
- 🚀 **脚本生成** - 动态生成 native.js 处理脚本

## 项目结构

```
contract-processor/
├── src/
│   ├── core/
│   │   ├── ScriptGenerator.js    # 脚本生成器
│   │   ├── DataProcessor.js       # 数据处理器
│   │   └── HTMLGenerator.js       # HTML 生成器
│   ├── mock/
│   │   └── MockDataSource.js      # 模拟数据源
│   ├── templates/
│   │   └── table.html             # HTML 模板
│   └── utils/
│       └── exporter.js            # 导出工具
├── dist/
│   └── native.template.js         # native.js 模板
├── examples/
│   └── demo.js                    # 示例代码
└── output/                        # 输出目录（自动创建）
```

## 快速开始

### 🌐 浏览器快速体验（推荐）

无需安装任何依赖，直接在浏览器中打开 `demo.html` 即可体验所有功能：

#### 使用方法
1. 在浏览器中打开 `demo.html`
2. **数据展示** - 50条模拟合同数据，支持分页浏览
3. **筛选搜索** - 按状态、类型筛选，或按关键词搜索
4. **导出功能** - 一键导出 HTML 报表或 CSV 文件
5. **脚本生成** - 自动生成 native.js 处理脚本
6. **模块测试** - 测试 getContracts() 和 updateContract() 功能

#### 在线分享
- **Netlify Drop** (推荐): 访问 https://app.netlify.com/drop，直接拖拽 `demo.html` 文件即可生成分享链接
- **GitHub Pages**: 将仓库推送到 GitHub，在 Settings > Pages 中启用

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd contract-processor

# 安装依赖（无外部依赖，可跳过）
npm install
```

### 运行示例

```bash
# 运行完整示例
npm run demo

# 执行 native.js 模板
npm run execute
```

## 使用方法

### 1. 数据获取

```javascript
const MockDataSource = require('./src/mock/MockDataSource');

const dataSource = new MockDataSource();

// 获取所有合同
const contracts = await dataSource.getContracts();

// 带条件查询
const activeContracts = await dataSource.getContracts({
  status: 'active',
  minAmount: 50000
});

// 根据 ID 获取
const contract = await dataSource.getContractById('CT0001');
```

### 2. 数据处理

```javascript
const DataProcessor = require('./src/core/DataProcessor');

const processor = new DataProcessor();

// 字段提取
await processor.process(contract, 'extract', {
  fields: ['id', 'name', 'amount']
});

// 字段转换
await processor.process(contract, 'transform', {
  transformations: {
    'name': { type: 'uppercase' },
    'amount': { type: 'multiply', factor: 1.1 }
  }
});

// 计算
await processor.process(contract, 'calculate', {
  expression: 'amount * 0.13',
  targetField: 'tax'
});
```

### 3. 生成 HTML 报表

```javascript
const HTMLGenerator = require('./src/core/HTMLGenerator');

const htmlGenerator = new HTMLGenerator();

const columns = [
  { field: 'contractNumber', label: '合同编号' },
  { field: 'name', label: '合同名称' },
  { field: 'amount', label: '金额', type: 'currency' },
  { field: 'status', label: '状态', type: 'status' }
];

const html = htmlGenerator.generateTable(contracts, columns, {
  title: '合同数据报表',
  subtitle: '生成时间: 2024-01-01'
});
```

### 4. 导出文件

```javascript
const Exporter = require('./src/utils/exporter');

const exporter = new Exporter();

// 导出 CSV
exporter.downloadCSV(data, 'contracts.csv', { columns });

// 导出 Excel
exporter.downloadExcel(data, 'contracts.xls', { columns });

// 导出 JSON
exporter.downloadJSON(data, 'contracts.json', { columns });
```

### 5. 使用 native.js 模板

```javascript
// 配置
const USER_CONFIG = {
  export: {
    format: 'html',
    columns: [
      { field: 'id', label: 'ID' },
      { field: 'name', label: '名称' }
    ],
    title: '我的报表'
  }
};

// 执行
const result = await execute({
  filters: { status: 'active' },
  operations: [
    { type: 'calculate', params: { expression: 'amount * 1.13', targetField: 'total' } }
  ]
});

// 保存
saveFile(result.output, 'report.html');
```

## 数据操作类型

| 操作类型 | 描述 | 参数 |
|---------|------|------|
| `extract` | 提取指定字段 | `fields: ['field1', 'field2']` |
| `transform` | 转换字段值 | `transformations: { field: { type: 'uppercase' } }` |
| `map` | 映射到新字段 | `mapping: { oldField: 'newField' }` |
| `calculate` | 计算新字段 | `expression: 'a + b', targetField: 'result'` |
| `validate` | 验证数据 | `rules: { field: { required: true } }` |
| `formatDate` | 格式化日期 | `field: 'date', format: 'YYYY-MM-DD'` |
| `formatCurrency` | 格式化货币 | `field: 'amount', currency: 'CNY'` |

## 列配置选项

```javascript
{
  field: 'fieldName',           // 字段名（支持嵌套：'fields.department'）
  label: '显示名称',             // 列标题
  type: 'currency',              // 类型：text/number/currency/date/status/badge/link/boolean
  width: '100px',                // 列宽
  align: 'right',                // 对齐：left/center/right
  currency: 'CNY',               // 货币类型（type=currency 时）
  format: 'YYYY-MM-DD',          // 日期格式（type=date 时）
  statusMap: {},                 // 状态映射（type=status 时）
  formatter: (value) => '',      // 自定义格式化函数
  sortable: true,                // 是否可排序
  cellClass: 'custom-class'      // 单元格样式类
}
```

## CLI 命令

```bash
# 使用 native.js 模板

# 获取数据
node dist/native.template.js fetch

# 更新合同
node dist/native.template.js update CT0001

# 执行并生成报表
node dist/native.template.js execute

# 导出指定格式
node dist/native.template.js export html
```

## 输出示例

生成的 HTML 报表包含：
- 美观的渐变头部
- 汇总统计信息（总记录数、总金额等）
- 可排序的数据表格
- 状态标签（不同颜色）
- 响应式设计（支持移动端）
- 打印友好样式
- 内置导出 CSV 功能

## 扩展开发

### 自定义数据操作

```javascript
const processor = new DataProcessor();

processor.registerOperation('customOp', async (contract, params) => {
  // 自定义处理逻辑
  return { data: modifiedContract };
});
```

### 自定义 HTML 模板

修改 `src/templates/table.html` 或创建新模板传入 `HTMLGenerator`。

## License

MIT
