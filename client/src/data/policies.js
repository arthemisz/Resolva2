export const POLICIES = [
  {
    id: 'POL-REF-01',
    category: 'Returns & Refunds',
    title: 'Returns & Refunds Policy',
    summary: 'Full refund within 30 days of purchase if unused with original packaging. Order number or receipt strictly required.',
    clauses: [
      'Full refund within 30 calendar days to original payment method.',
      'Item must be unused with tags and original packaging intact.',
      'Order number (#XXXX) or valid store receipt is strictly required.'
    ],
    fields: ['Order Number or Receipt', 'Purchase Date', 'Item Condition']
  },
  {
    id: 'POL-SHP-02',
    category: 'Shipping & Delivery',
    title: 'Carrier Delivery & Lost Package Policy',
    summary: 'Report lost/missing delivery within 7 business days of marked delivery. Replacement dispatched upon carrier check.',
    clauses: [
      'Report missing shipments within 7 business days of marked delivery.',
      'Carrier tracer takes 24 to 48 hours to confirm status.',
      'Expedited replacement parcel dispatched upon carrier check.'
    ],
    fields: ['Order / Tracking ID', 'Porch & Neighbor Check']
  },
  {
    id: 'POL-SUB-03',
    category: 'Subscription & Billing',
    title: 'Subscription Cancellation & Refund Terms',
    summary: 'Monthly plans cancel at end of billing cycle. Refund issued only if requested within 48 hours of renewal.',
    clauses: [
      'Cancellations take effect at conclusion of current billing period.',
      'Refunds issued only if requested within 48 hours of renewal.',
      'Credit reversal reflects in 3 to 5 business days.'
    ],
    fields: ['Account Email', 'Renewal Timestamp']
  }
];

export const getPolicyById = (id) => POLICIES.find(p => p.id === id) || POLICIES[0];
