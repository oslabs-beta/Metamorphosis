'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AlertRule } from '@/types';

interface AlertConfigProps {
  onSave?: () => void;
}

const AlertConfig: React.FC<AlertConfigProps> = ({ onSave }) => {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<AlertRule> | null>(null);
  const [newChannel, setNewChannel] = useState('');

  const availableMetrics = [
    'kafka_consumergroup_group_lag',
    'kafka_cluster_partition_underreplicated',
    'kafka_controller_kafkacontroller_offlinepartitionscount',
    'jvm_memory_bytes_used',
    'kafka_server_brokertopicmetrics_bytesin_total',
  ];

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alerts/rules');
      if (!response.ok) throw new Error('Failed to fetch rules');
      const data = await response.json();
      setRules(data.rules || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = () => {
    setEditingRule({
      name: '',
      metric: '',
      threshold: 0,
      operator: 'gt',
      duration: 0,
      enabled: true,
      notificationChannels: [],
    });
    setOpenDialog(true);
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule({ ...rule });
    setOpenDialog(true);
  };

  const handleSaveRule = async () => {
    if (!editingRule) return;

    try {
      const url = editingRule.id
        ? `/api/alerts/rules/${editingRule.id}`
        : '/api/alerts/rules';
      const method = editingRule.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRule),
      });

      if (!response.ok) throw new Error('Failed to save rule');

      setOpenDialog(false);
      setEditingRule(null);
      fetchRules();
      onSave?.();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this alert rule?')) return;

    try {
      const response = await fetch(`/api/alerts/rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete rule');

      fetchRules();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleEnabled = async (rule: AlertRule) => {
    const updatedRule = { ...rule, enabled: !rule.enabled };
    try {
      const response = await fetch(`/api/alerts/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRule),
      });

      if (!response.ok) throw new Error('Failed to update rule');

      fetchRules();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addNotificationChannel = () => {
    if (!editingRule || !newChannel.trim()) return;

    const channels = editingRule.notificationChannels || [];
    if (!channels.includes(newChannel.trim())) {
      setEditingRule({
        ...editingRule,
        notificationChannels: [...channels, newChannel.trim()],
      });
    }
    setNewChannel('');
  };

  const removeNotificationChannel = (channel: string) => {
    if (!editingRule) return;

    setEditingRule({
      ...editingRule,
      notificationChannels:
        editingRule.notificationChannels?.filter((c) => c !== channel) || [],
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Alert Rules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateRule}
        >
          Create Alert Rule
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {rules.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No alert rules configured. Create one to get started.
          </Typography>
        </Paper>
      ) : (
        rules.map((rule) => (
          <Paper key={rule.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6">{rule.name}</Typography>
                  <Chip
                    label={rule.enabled ? 'Enabled' : 'Disabled'}
                    color={rule.enabled ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Metric: <strong>{rule.metric}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Condition: <strong>{rule.operator}</strong> {rule.threshold}
                </Typography>
                {rule.notificationChannels.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Channels:
                    </Typography>
                    {rule.notificationChannels.map((channel) => (
                      <Chip
                        key={channel}
                        label={channel}
                        size="small"
                        sx={{ mr: 0.5, mt: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rule.enabled}
                      onChange={() => handleToggleEnabled(rule)}
                    />
                  }
                  label="Enabled"
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleEditRule(rule)}
                >
                  Edit
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteRule(rule.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRule?.id ? 'Edit Alert Rule' : 'Create Alert Rule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Rule Name"
              value={editingRule?.name || ''}
              onChange={(e) =>
                setEditingRule({ ...editingRule!, name: e.target.value })
              }
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Metric</InputLabel>
              <Select
                value={editingRule?.metric || ''}
                label="Metric"
                onChange={(e) =>
                  setEditingRule({ ...editingRule!, metric: e.target.value })
                }
              >
                {availableMetrics.map((metric) => (
                  <MenuItem key={metric} value={metric}>
                    {metric}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={editingRule?.operator || 'gt'}
                  label="Operator"
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule!,
                      operator: e.target.value as AlertRule['operator'],
                    })
                  }
                >
                  <MenuItem value="gt">&gt;</MenuItem>
                  <MenuItem value="gte">&gt;=</MenuItem>
                  <MenuItem value="lt">&lt;</MenuItem>
                  <MenuItem value="lte">&lt;=</MenuItem>
                  <MenuItem value="eq">=</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Threshold"
                type="number"
                value={editingRule?.threshold || 0}
                onChange={(e) =>
                  setEditingRule({
                    ...editingRule!,
                    threshold: Number(e.target.value),
                  })
                }
                fullWidth
                required
              />
            </Box>

            <TextField
              label="Duration (seconds)"
              type="number"
              value={editingRule?.duration || 0}
              onChange={(e) =>
                setEditingRule({
                  ...editingRule!,
                  duration: Number(e.target.value),
                })
              }
              helperText="Alert must fire for this duration before triggering"
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Notification Channels
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="email:user@example.com or slack:webhook_url"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addNotificationChannel();
                    }
                  }}
                  sx={{ flex: 1 }}
                />
                <Button onClick={addNotificationChannel}>Add</Button>
              </Box>
              {editingRule?.notificationChannels?.map((channel) => (
                <Chip
                  key={channel}
                  label={channel}
                  onDelete={() => removeNotificationChannel(channel)}
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveRule}
            disabled={
              !editingRule?.name ||
              !editingRule?.metric ||
              editingRule?.threshold === undefined
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertConfig;

