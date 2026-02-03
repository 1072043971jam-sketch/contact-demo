/**
 * 简单使用示例
 */

const MockDataSource = require('./src/mock/MockDataSource.js');
const HTMLGenerator = require('./src/core/HTMLGenerator.js');
const fs = require('fs');
const path = require('path');

async function main() {
  // 1. 创建数据源
  const dataSource = new MockDataSource();

  // 2. 获取合同数据（可以加过滤条件）
  const contracts = await dataSource.getContracts({
    status: 'active'  // 只要生效中的合同
  });

  console.log(`获取到 ${contracts.length} 条合同`);

  // 3. 定义表格列
  const columns = [
    { field: 'contractNumber', label: '合同编号' },
    { field: 'name', label: '合同名称' },
    { field: 'type', label: '类型' },
    { field: 'amount', label: '金额', type: 'currency', currency: 'CNY' },
    { field: 'counterparty', label: '对方单位' },
    { field: 'status', label: '状态', type: 'status' },
    { field: 'startDate', label: '开始日期', type: 'date' },
    { field: 'endDate', label: '结束日期', type: 'date' }
  ];

  // 4. 生成 HTML
  const htmlGenerator = new HTMLGenerator();
  const html = htmlGenerator.generateTable(contracts, columns, {
    title: '我的合同报表',
    subtitle: '生成于 ' + new Date().toLocaleDateString('zh-CN')
  });

  // 5. 保存文件
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputFile = path.join(outputDir, 'my-report.html');
  fs.writeFileSync(outputFile, html, 'utf-8');

  console.log(`报表已保存: ${outputFile}`);
}

main();
