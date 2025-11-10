import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import {
  DollarSign,
  Tag,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/useAuth.js';
import { paymentAdminApi } from '../../services/api.js';

const PaymentManagement = () => {
  const { token } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();

  // Payment Configs
  const [paymentConfigs, setPaymentConfigs] = useState([]);
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [configForm, setConfigForm] = useState({
    founderEmail: '',
    customAmount: '',
    notes: '',
  });

  // Coupons
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minAmount: '',
    maxUses: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  // Coupon Settings
  const [couponEnabled, setCouponEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Fetch payment configs
  const fetchPaymentConfigs = async () => {
    if (!token) return;
    setLoadingConfigs(true);
    try {
      const response = await paymentAdminApi.getPaymentConfigs(token);
      setPaymentConfigs(response.items || []);
    } catch (error) {
      showError('Failed to fetch payment configs');
      console.error(error);
    } finally {
      setLoadingConfigs(false);
    }
  };

  // Fetch coupons
  const fetchCoupons = async () => {
    if (!token) return;
    setLoadingCoupons(true);
    try {
      const response = await paymentAdminApi.getCoupons(token);
      setCoupons(response.items || []);
    } catch (error) {
      showError('Failed to fetch coupons');
      console.error(error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Fetch coupon settings
  const fetchCouponSettings = async () => {
    if (!token) return;
    setLoadingSettings(true);
    try {
      const response = await paymentAdminApi.getCouponSettings(token);
      setCouponEnabled(response.couponEnabled);
    } catch (error) {
      showError('Failed to fetch coupon settings');
      console.error(error);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPaymentConfigs();
      fetchCoupons();
      fetchCouponSettings();
    }
  }, [token]);

  // Payment Config Handlers
  const handleSaveConfig = async () => {
    if (!configForm.founderEmail || !configForm.customAmount) {
      showInfo('Please fill in all required fields');
      return;
    }

    try {
      await paymentAdminApi.createOrUpdatePaymentConfig(
        {
          founderEmail: configForm.founderEmail,
          customAmount: parseFloat(configForm.customAmount),
          notes: configForm.notes,
        },
        token
      );
      showSuccess('Payment config saved successfully');
      setShowConfigForm(false);
      setEditingConfig(null);
      setConfigForm({ founderEmail: '', customAmount: '', notes: '' });
      fetchPaymentConfigs();
    } catch (error) {
      showError(error.message || 'Failed to save payment config');
    }
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
    setConfigForm({
      founderEmail: config.founderEmail,
      customAmount: config.customAmount.toString(),
      notes: config.notes || '',
    });
    setShowConfigForm(true);
  };

  const handleDeleteConfig = async (email) => {
    if (!confirm(`Are you sure you want to delete payment config for ${email}?`)) {
      return;
    }

    try {
      await paymentAdminApi.deletePaymentConfig(email, token);
      showSuccess('Payment config deleted successfully');
      fetchPaymentConfigs();
    } catch (error) {
      showError(error.message || 'Failed to delete payment config');
    }
  };

  // Coupon Handlers
  const handleSaveCoupon = async () => {
    if (!couponForm.code || !couponForm.discountValue) {
      showInfo('Please fill in all required fields');
      return;
    }

    try {
      const couponData = {
        ...couponForm,
        discountValue: parseFloat(couponForm.discountValue),
        maxDiscountAmount: couponForm.maxDiscountAmount
          ? parseFloat(couponForm.maxDiscountAmount)
          : null,
        minAmount: couponForm.minAmount ? parseFloat(couponForm.minAmount) : 0,
        maxUses: couponForm.maxUses ? parseInt(couponForm.maxUses, 10) : null,
        validFrom: couponForm.validFrom || new Date().toISOString().split('T')[0],
        validUntil: couponForm.validUntil || null,
      };

      if (editingCoupon) {
        await paymentAdminApi.updateCoupon(editingCoupon.code, couponData, token);
        showSuccess('Coupon updated successfully');
      } else {
        await paymentAdminApi.createCoupon(couponData, token);
        showSuccess('Coupon created successfully');
      }

      setShowCouponForm(false);
      setEditingCoupon(null);
      setCouponForm({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscountAmount: '',
        minAmount: '',
        maxUses: '',
        validFrom: '',
        validUntil: '',
        isActive: true,
      });
      fetchCoupons();
    } catch (error) {
      showError(error.message || 'Failed to save coupon');
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
      minAmount: coupon.minAmount?.toString() || '0',
      maxUses: coupon.maxUses?.toString() || '',
      validFrom: coupon.validFrom
        ? new Date(coupon.validFrom).toISOString().split('T')[0]
        : '',
      validUntil: coupon.validUntil
        ? new Date(coupon.validUntil).toISOString().split('T')[0]
        : '',
      isActive: coupon.isActive,
    });
    setShowCouponForm(true);
  };

  const handleDeleteCoupon = async (code) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) {
      return;
    }

    try {
      await paymentAdminApi.deleteCoupon(code, token);
      showSuccess('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      showError(error.message || 'Failed to delete coupon');
    }
  };

  // Toggle coupon enabled
  const handleToggleCouponEnabled = async () => {
    try {
      await paymentAdminApi.updateCouponSettings({ couponEnabled: !couponEnabled }, token);
      setCouponEnabled(!couponEnabled);
      showSuccess(`Coupon section ${!couponEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      showError('Failed to update coupon settings');
    }
  };

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
      </div>

      {/* Coupon Settings Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Coupon Settings
            </CardTitle>
            <Button
              variant="outline"
              onClick={handleToggleCouponEnabled}
              disabled={loadingSettings}
            >
              {couponEnabled ? (
                <ToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-400" />
              )}
              <span className="ml-2">
                {couponEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Toggle the coupon section visibility on the payment confirmation page. When enabled,
            founders can apply coupon codes during checkout.
          </p>
        </CardContent>
      </Card>

      {/* Payment Configs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Configurations
            </CardTitle>
            <Button
              onClick={() => {
                setShowConfigForm(true);
                setEditingConfig(null);
                setConfigForm({ founderEmail: '', customAmount: '', notes: '' });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Config
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showConfigForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {editingConfig ? 'Edit Payment Config' : 'Add Payment Config'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowConfigForm(false);
                    setEditingConfig(null);
                    setConfigForm({ founderEmail: '', customAmount: '', notes: '' });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="founderEmail">Founder Email *</Label>
                  <Input
                    id="founderEmail"
                    type="email"
                    value={configForm.founderEmail}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, founderEmail: e.target.value })
                    }
                    placeholder="founder@example.com"
                    disabled={!!editingConfig}
                  />
                </div>
                <div>
                  <Label htmlFor="customAmount">Custom Amount (INR) *</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    value={configForm.customAmount}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, customAmount: e.target.value })
                    }
                    placeholder="4999"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={configForm.notes}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, notes: e.target.value })
                    }
                    placeholder="Optional notes"
                  />
                </div>
                <Button onClick={handleSaveConfig}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}

          {loadingConfigs ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : paymentConfigs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No payment configs found. Click "Add Config" to create one.
            </p>
          ) : (
            <div className="space-y-2">
              {paymentConfigs.map((config) => (
                <div
                  key={config._id || config.founderEmail}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{config.founderEmail}</p>
                    <p className="text-sm text-gray-600">
                      {formatAmount(config.customAmount)}
                      {config.notes && ` - ${config.notes}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditConfig(config)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConfig(config.founderEmail)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coupons Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Coupons
            </CardTitle>
            <Button
              onClick={() => {
                setShowCouponForm(true);
                setEditingCoupon(null);
                setCouponForm({
                  code: '',
                  description: '',
                  discountType: 'percentage',
                  discountValue: '',
                  maxDiscountAmount: '',
                  minAmount: '',
                  maxUses: '',
                  validFrom: '',
                  validUntil: '',
                  isActive: true,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCouponForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCouponForm(false);
                    setEditingCoupon(null);
                    setCouponForm({
                      code: '',
                      description: '',
                      discountType: 'percentage',
                      discountValue: '',
                      maxDiscountAmount: '',
                      minAmount: '',
                      maxUses: '',
                      validFrom: '',
                      validUntil: '',
                      isActive: true,
                    });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="SAVE20"
                    disabled={!!editingCoupon}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={couponForm.description}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, description: e.target.value })
                    }
                    placeholder="20% off on activation fee"
                  />
                </div>
                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <select
                    id="discountType"
                    className="w-full h-10 px-3 border rounded-md"
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, discountType: e.target.value })
                    }
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={couponForm.discountValue}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, discountValue: e.target.value })
                    }
                    placeholder={couponForm.discountType === 'percentage' ? '20' : '1000'}
                    min="0"
                  />
                </div>
                {couponForm.discountType === 'percentage' && (
                  <div>
                    <Label htmlFor="maxDiscountAmount">Max Discount (INR)</Label>
                    <Input
                      id="maxDiscountAmount"
                      type="number"
                      value={couponForm.maxDiscountAmount}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, maxDiscountAmount: e.target.value })
                      }
                      placeholder="500"
                      min="0"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="minAmount">Minimum Amount (INR)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={couponForm.minAmount}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, minAmount: e.target.value })
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxUses">Max Uses</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={couponForm.maxUses}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, maxUses: e.target.value })
                    }
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={couponForm.validFrom}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, validFrom: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={couponForm.validUntil}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, validUntil: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={couponForm.isActive}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              <Button onClick={handleSaveCoupon} className="mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}

          {loadingCoupons ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : coupons.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No coupons found. Click "Add Coupon" to create one.
            </p>
          ) : (
            <div className="space-y-2">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id || coupon.code}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{coupon.code}</p>
                      {coupon.isActive ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% off`
                        : `${formatAmount(coupon.discountValue)} off`}
                      {coupon.description && ` - ${coupon.description}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Used: {coupon.usedCount || 0}
                      {coupon.maxUses && ` / ${coupon.maxUses}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement;

