'use client';

import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportToCSV } from '@/lib/export/pdf';

interface ExportButtonProps {
  data: {
    title?: string;
    metrics?: Array<{ name: string; value: number | string; unit?: string }>;
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
  };
  csvData?: Array<{
    timestamp: number;
    [key: string]: number | string;
  }>;
  onExport?: (type: 'pdf' | 'csv') => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  csvData,
  onExport,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePDFExport = async () => {
    setLoading(true);
    handleClose();

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pdf',
          data: {
            ...data,
            filename: `${data.title || 'report'}-${Date.now()}.pdf`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.title || 'report'}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onExport?.('pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCSVExport = () => {
    handleClose();

    if (csvData && csvData.length > 0) {
      exportToCSV(csvData, `${data.title || 'metrics'}-${Date.now()}.csv`);
      onExport?.('csv');
    } else {
      alert('No data available for CSV export');
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={loading ? <CircularProgress size={16} /> : <FileDownloadIcon />}
        onClick={handleClick}
        disabled={loading}
      >
        Export
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handlePDFExport}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCSVExport} disabled={!csvData || csvData.length === 0}>
          <ListItemIcon>
            <TableChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButton;

