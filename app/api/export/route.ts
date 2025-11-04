import { NextRequest, NextResponse } from 'next/server';
import { generatePDFReport, ExportData } from '@/lib/export/pdf';
import { queryHistoricalMetrics } from '@/lib/metrics/ingestion';

// POST /api/export/pdf - Generate PDF report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, options } = body;

    if (type === 'pdf') {
      const exportData: ExportData = {
        title: data.title || 'Metamorphosis Report',
        metrics: data.metrics,
        tables: data.tables,
        timeSeriesData: data.timeSeriesData,
      };

      const pdfBlob = generatePDFReport(exportData);
      const buffer = await pdfBlob.arrayBuffer();

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${data.filename || 'report.pdf'}"`,
        },
      });
    }

    if (type === 'csv') {
      // CSV export is handled client-side, but we can provide data here
      const searchParams = request.nextUrl.searchParams;
      const metric = searchParams.get('metric');
      const startTime = searchParams.get('startTime');
      const endTime = searchParams.get('endTime');

      if (!metric || !startTime || !endTime) {
        return NextResponse.json(
          { error: 'Missing required parameters for CSV export' },
          { status: 400 }
        );
      }

      const historicalData = await queryHistoricalMetrics(
        metric,
        parseInt(startTime, 10),
        parseInt(endTime, 10)
      );

      // Convert to CSV format
      const csvRows = historicalData.map((point) => ({
        timestamp: new Date(point.timestamp * 1000).toISOString(),
        value: point.value,
        ...point.labels,
      }));

      const csv = [
        Object.keys(csvRows[0] || {}).join(','),
        ...csvRows.map((row) =>
          Object.values(row)
            .map((val) => (typeof val === 'string' ? `"${val}"` : val))
            .join(',')
        ),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${metric}-${startTime}-${endTime}.csv"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'Unsupported export type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error generating export:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate export' },
      { status: 500 }
    );
  }
}

// GET /api/export/csv - Export CSV data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get('metric');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const clusterId = searchParams.get('clusterId');

    if (!metric || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required parameters: metric, startTime, endTime' },
        { status: 400 }
      );
    }

    const historicalData = await queryHistoricalMetrics(
      metric,
      parseInt(startTime, 10),
      parseInt(endTime, 10),
      clusterId || undefined
    );

    if (historicalData.length === 0) {
      return NextResponse.json(
        { error: 'No data found for the specified parameters' },
        { status: 404 }
      );
    }

    // Convert to CSV format
    const csvRows = historicalData.map((point) => ({
      timestamp: new Date(point.timestamp * 1000).toISOString(),
      value: point.value,
      ...point.labels,
    }));

    const csv = [
      Object.keys(csvRows[0] || {}).join(','),
      ...csvRows.map((row) =>
        Object.values(row)
          .map((val) => {
            if (typeof val === 'string') {
              // Escape quotes and wrap in quotes if contains comma
              const escaped = val.replace(/"/g, '""');
              return val.includes(',') || val.includes('"') ? `"${escaped}"` : val;
            }
            return val;
          })
          .join(',')
      ),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${metric}-export-${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export CSV' },
      { status: 500 }
    );
  }
}

