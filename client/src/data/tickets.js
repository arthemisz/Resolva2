export const INITIAL_TICKETS = [
  {
    id: '#1001',
    customer: 'Alice Smith',
    email: 'alice.smith@example.com',
    category: 'Returns & Refunds',
    subject: 'Want to return jacket',
    message: "I bought this winter jacket last week, but it's too big. I want my money back.",
    time: '12m ago',
    status: 'Open',
    policyId: 'POL-REF-01',
    intent: 'Customer wants a refund for an oversized jacket bought 1 week ago.',
    confidence: 98.4,
    missing: [
      { name: 'Order number or receipt', ok: false },
      { name: 'Confirmation of unused condition', ok: false }
    ],
    draft: `Hello Alice,\n\nThanks for reaching out. Under our Returns & Refunds policy [POL-REF-01], we can help process your return.\n\nPlease share your order number or a copy of your receipt, and confirm that the jacket is unused with tags attached. Once confirmed, we'll send a prepaid return label.\n\nBest,\nResolva Support`
  },
  {
    id: '#1002',
    customer: 'Bob Jones',
    email: 'bob.jones@example.com',
    category: 'Shipping & Delivery',
    subject: 'Package not delivered',
    message: 'Tracking says my order #4592 was delivered yesterday, but nothing is on my porch.',
    time: '34m ago',
    status: 'Open',
    policyId: 'POL-SHP-02',
    intent: 'Disputed delivery report within 24 hours of courier delivery scan.',
    confidence: 99.1,
    missing: [{ name: 'Porch and neighbor check confirmation', ok: false }],
    draft: `Hello Bob,\n\nSorry to hear your package hasn't arrived. Under policy [POL-SHP-02], we opened a trace with the carrier for order #4592.\n\nIf you haven't yet, please check with neighbors or building staff. If the courier cannot locate it within 24 hours, we will dispatch a replacement immediately.\n\nBest,\nResolva Support`
  },
  {
    id: '#1003',
    customer: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    category: 'Subscription & Billing',
    subject: 'Charged after cancelling',
    message: 'I cancelled my plan last month, but I see a new charge today on my card.',
    time: '1h ago',
    status: 'Open',
    policyId: 'POL-SUB-03',
    intent: 'Billing dispute regarding recurring renewal charge after cancellation.',
    confidence: 97.6,
    missing: [{ name: 'Account email verification', ok: true }],
    draft: `Hello Charlie,\n\nThank you for reaching out. In accordance with policy [POL-SUB-03], charges requested within 48 hours of renewal are refunded in full.\n\nI verified your prior cancellation and initiated an immediate refund. It should appear on your statement in 3 to 5 business days.\n\nBest,\nResolva Support`
  },
  {
    id: '#1004',
    customer: 'Diana Prince',
    email: 'diana.prince@example.com',
    category: 'Returns & Refunds',
    subject: 'Return request for headphones',
    message: 'These headphones stopped working. Can I get a refund?',
    time: '3h ago',
    status: 'Open',
    policyId: 'POL-REF-01',
    intent: 'Defective item refund request; requires purchase date check.',
    confidence: 96.2,
    missing: [
      { name: 'Order number', ok: false },
      { name: 'Purchase date (30-day refund vs 1-year warranty)', ok: false }
    ],
    draft: `Hello Diana,\n\nSorry about the headphone issue. Standard refunds apply within 30 days under [POL-REF-01].\n\nCould you send your order number and purchase date? If it's within 30 days we will process a return; if older, we will route this through our 1-year hardware warranty.\n\nBest,\nResolva Support`
  },
  {
    id: '#1005',
    customer: 'Evan Wright',
    email: 'evan.wright@example.com',
    category: 'Shipping & Delivery',
    subject: 'Delayed shipping',
    message: "My express delivery hasn't arrived yet and it's been 4 days.",
    time: '5h ago',
    status: 'Open',
    policyId: 'POL-SHP-02',
    intent: 'Transit delay inquiry exceeding express shipment timeline.',
    confidence: 97.8,
    missing: [{ name: 'Tracking or order number', ok: false }],
    draft: `Hello Evan,\n\nThanks for flagging the delay. Under policy [POL-SHP-02], we investigate delayed express packages directly with dispatch.\n\nPlease share your tracking or order number so we can locate the parcel and expedite delivery.\n\nBest,\nResolva Support`
  }
];
