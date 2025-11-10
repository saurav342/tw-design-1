# Razorpay Payment Gateway Integration

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env` file in the backend directory:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Get Razorpay Credentials

1. Sign up for a Razorpay account at https://razorpay.com
2. Go to Settings > API Keys
3. Generate API keys (Test keys for development, Live keys for production)
4. Copy the Key ID and Key Secret
5. Add them to your `.env` file

### 3. Razorpay Dashboard Settings

- Enable webhooks (optional but recommended)
- Set up webhook URL: `https://your-domain.com/api/payment/webhook`
- Configure payment methods you want to accept

### 4. Default Payment Amount

The default payment amount is set to **₹4,999 INR**. This can be customized per founder email through the admin panel.

### 5. Testing

#### Test Cards (for testing in development)
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

## Features

### Payment Configuration
- Admin can set custom payment amounts per founder email
- Default amount: ₹4,999 INR
- Amounts are displayed on the payment details page during founder signup

### Coupon Management
- Admin can create, edit, and delete coupons
- Coupons support:
  - Percentage discounts
  - Fixed amount discounts
  - Minimum amount requirements
  - Maximum uses
  - Validity dates
  - Active/Inactive status
- Coupon section can be toggled on/off from admin panel
- Coupons are validated before payment

### Payment Flow
1. Founder completes signup
2. Redirected to payment details page (shows custom amount if configured)
3. Redirected to checkout page
4. Can apply coupon code (if enabled)
5. Razorpay payment gateway opens
6. Payment is processed
7. Payment is verified on backend
8. Redirected to payment confirmation page

## API Endpoints

### Public Endpoints
- `GET /api/payment/amount?email=founder@example.com` - Get payment amount for founder
- `GET /api/payment/coupon-settings` - Get coupon settings (enabled/disabled)
- `POST /api/payment/validate-coupon` - Validate a coupon code
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/status/:orderId` - Get payment status

### Admin Endpoints (Requires Admin Authentication)
- `GET /api/admin/payment/payment-configs` - Get all payment configs
- `POST /api/admin/payment/payment-configs` - Create/update payment config
- `DELETE /api/admin/payment/payment-configs/:email` - Delete payment config
- `GET /api/admin/payment/coupons` - Get all coupons
- `POST /api/admin/payment/coupons` - Create coupon
- `PATCH /api/admin/payment/coupons/:code` - Update coupon
- `DELETE /api/admin/payment/coupons/:code` - Delete coupon
- `GET /api/admin/payment/coupon-settings` - Get coupon settings
- `PATCH /api/admin/payment/coupon-settings` - Update coupon settings

## Database Models

### Payment
- Stores payment records with Razorpay order IDs
- Tracks payment status (pending, completed, failed, refunded)
- Stores coupon information if applied

### PaymentConfig
- Stores custom payment amounts per founder email
- Allows admins to set different amounts for different founders

### Coupon
- Stores coupon codes and discount rules
- Tracks usage count
- Supports percentage and fixed discounts
- Validates based on amount, dates, and usage limits

### Settings
- Stores application settings like coupon enabled/disabled status

## Admin Panel

Access the payment management section from the Admin Dashboard:
1. Login as admin
2. Navigate to "Payments" in the sidebar
3. Manage payment configs and coupons
4. Toggle coupon section on/off

## Troubleshooting

### Payment Not Processing
- Check Razorpay credentials in `.env`
- Verify Razorpay account is activated
- Check Razorpay dashboard for any restrictions
- Verify webhook URL is correct (if using webhooks)

### Coupon Not Working
- Check if coupon is active
- Verify coupon validity dates
- Check minimum amount requirement
- Verify maximum uses limit
- Ensure coupon section is enabled in settings

### Custom Amount Not Showing
- Verify payment config is created for the founder email
- Check if payment config is active
- Verify email matches exactly (case-insensitive)

