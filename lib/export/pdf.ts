import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
  title: string;
  metrics?: Array<{
    name: string;
    value: number | string;
    unit?: string;
  }>;
  timeSeriesData?: Array<{
    metric: string;
    timestamps: number[];
    values: number[];
  }>;
  tables?: Array<{
    title: string;
    headers: string[];
    rows: (string | number)[][];
  }>;
}

/**
 * Generate PDF report from dashboard data
 */
export function generatePDFReport(data: ExportData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Title
  doc.setFontSize(18);
  doc.text(data.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  yPosition += 15;

  // Metrics section
  if (data.metrics && data.metrics.length > 0) {
    doc.setFontSize(14);
    doc.text('Key Metrics', 14, yPosition);
    yPosition += 10;

    const metricsTable: (string | number)[][] = data.metrics.map((m) => [
      m.name,
      `${m.value}${m.unit ? ` ${m.unit}` : ''}`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: metricsTable,
      theme: 'striped',
      headStyles: { fillColor: [25, 118, 210] },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Tables section
  if (data.tables && data.tables.length > 0) {
    for (const table of data.tables) {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(table.title, 14, yPosition);
      yPosition += 10;

      autoTable(doc, {
        startY: yPosition,
        head: [table.headers],
        body: table.rows,
        theme: 'striped',
        headStyles: { fillColor: [25, 118, 210] },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
  }

  // Time series summary (if provided)
  if (data.timeSeriesData && data.timeSeriesData.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text('Time Series Summary', 14, yPosition);
    yPosition += 10;

    const summaryRows: (string | number)[][] = data.timeSeriesData.map((series) => {
      const avg =
        series.values.reduce((sum, val) => sum + val, 0) / series.values.length;
      const max = Math.max(...series.values);
      const min = Math.min(...series.values);

      return [
        series.metric,
        avg.toFixed(2),
        max.toFixed(2),
        min.toFixed(2),
        series.values.length.toString(),
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Average', 'Max', 'Min', 'Data Points']],
      body: summaryRows,
      theme: 'striped',
      headStyles: { fillColor: [25, 118, 210] },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount} - Metamorphosis Observability Platform`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}

/**
 * Export time-series data to CSV
 */
export function exportToCSV(
  data: Array<{
    timestamp: number;
    [key: string]: number | string;
  }>,
  filename: string = 'metrics.csv'
): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get all column names
  const columns = Object.keys(data[0]);
  
  // Create CSV header
  const header = columns.join(',');
  
  // Create CSV rows
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col];
      // Escape values containing commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

