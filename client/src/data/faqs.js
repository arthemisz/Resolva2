export const FAQS = [
  {
    q: 'What is Resolva and how does it work?',
    a: 'Resolva is an AI-powered inventory management system that lets you manage your warehouse stock using natural language. Simply tell the AI what you need - like "sell 5 bags of flour" or "add 10 bottles of oil" - and it updates your inventory in real-time.'
  },
  {
    q: 'Do I need technical knowledge to use Resolva?',
    a: 'No! Resolva is designed to be intuitive. You can manage your inventory by typing plain English commands in the chat interface. No coding, no complex forms - just natural conversation with the AI agent.'
  },
  {
    q: 'Is my inventory data secure?',
    a: 'Yes. Resolva uses JWT authentication to protect your account. Each user has their own isolated inventory - you can only see and manage your own products. All data is stored securely in MongoDB Atlas with industry-standard encryption.'
  },
  {
    q: 'Can multiple users manage inventory on the same account?',
    a: 'Currently, each account has its own separate inventory. If you need team collaboration, each team member can create their own account to manage their assigned inventory independently.'
  },
  {
    q: 'What kind of inventory operations can I perform?',
    a: 'You can perform all essential inventory operations: add new products, record sales, track deliveries, process returns, update stock levels, search products, and view transaction history. The AI agent understands natural language commands for all these operations.'
  },
  {
    q: 'How accurate is the AI in understanding my commands?',
    a: 'The AI agent is powered by Google Gemini and is trained to understand inventory-related commands accurately. It will ask for clarification if it needs more information, and you can always review and confirm transactions before they are finalized.'
  },
  {
    q: 'Can I track my inventory history?',
    a: 'Yes! Every inventory movement is recorded in the audit ledger. You can see all transactions including sales, deliveries, and returns with timestamps, helping you maintain accurate stock records and analyze inventory trends.'
  },
  {
    q: 'What happens if I make a mistake?',
    a: 'The system shows you transaction details before confirming any changes. If you catch an error before confirming, you can cancel it. After confirmation, you can record a correction transaction to adjust the inventory.'
  }
];
