import { useWalletStore, Transaction } from './walletStore';

export interface CategorySummary {
    category: string;
    amount: number;
    color: string;
    percentage: number;
}

export interface AnalyticsData {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingsRate: number;
    categories: CategorySummary[];
    weeklyData: { day: string; income: number; expense: number }[];
}

// Helper to guess category based on title or note
const categorizeTransaction = (tx: Transaction): { name: string; color: string } => {
    const text = (tx.title + ' ' + (tx.note || '')).toLowerCase();

    if (text.includes('کافه') || text.includes('coffee') || text.includes('cafe') || text.includes('رستوران')) return { name: 'Food & Dining', color: '#f43f5e' }; // rose-500
    if (text.includes('قبض') || text.includes('bill') || text.includes('electricity') || text.includes('برق')) return { name: 'Bills & Utilities', color: '#8b5cf6' }; // violet-500
    if (text.includes('شارژ') || text.includes('topup') || text.includes('اینترنت')) return { name: 'Mobile & Net', color: '#0ea5e9' }; // sky-500
    if (text.includes('کتاب') || text.includes('book') || text.includes('دانشگاه')) return { name: 'Education', color: '#10b981' }; // emerald-500
    if (text.includes('اسنپ') || text.includes('taxi') || text.includes('snapp') || text.includes('ride')) return { name: 'Transport', color: '#f59e0b' }; // amber-500
    if (tx.type === 'receive' || tx.type === 'deposit') {
        if (text.includes('حقوق') || text.includes('salary')) return { name: 'Salary', color: '#10b981' };
        return { name: 'Other Income', color: '#059669' };
    }
    return { name: 'Miscellaneous', color: '#64748b' }; // slate-500
};

export const getAnalytics = (): AnalyticsData => {
    const { transactions } = useWalletStore.getState();

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = new Map<string, { amount: number; color: string }>();

    // Mock weekly data
    const weeklyMap = new Map<string, { income: number; expense: number }>();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => weeklyMap.set(day, { income: 0, expense: 0 }));

    transactions.forEach(tx => {
        // Map to today for mock
        const randomDay = days[Math.floor(Math.random() * 7)];
        const dayData = weeklyMap.get(randomDay)!;

        if (tx.type === 'send') {
            totalExpense += tx.amount;
            dayData.expense += tx.amount;

            const cat = categorizeTransaction(tx);
            if (categoryMap.has(cat.name)) {
                categoryMap.get(cat.name)!.amount += tx.amount;
            } else {
                categoryMap.set(cat.name, { amount: tx.amount, color: cat.color });
            }
        } else {
            totalIncome += tx.amount;
            dayData.income += tx.amount;
        }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    const categories: CategorySummary[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
        category: name,
        amount: data.amount,
        color: data.color,
        percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    const weeklyData = Array.from(weeklyMap.entries()).map(([day, data]) => ({
        day,
        income: data.income,
        expense: data.expense
    }));

    return {
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate,
        categories,
        weeklyData
    };
};

export const getAIInsights = (analytics: AnalyticsData): string[] => {
    const insights: string[] = [];
    if (analytics.savingsRate < 10 && analytics.totalIncome > 0) {
        insights.push('savings_low'); // We'll translate this in UI
    }
    if (analytics.categories.length > 0 && analytics.categories[0].percentage > 40) {
        insights.push('high_spending_category:' + analytics.categories[0].category.toLowerCase().replace(/\s+/g, '_'));
    }
    if (analytics.netSavings > 2000) {
        insights.push('good_savings');
    }
    if (insights.length === 0) {
        insights.push('stable_finances');
    }
    return insights;
};
