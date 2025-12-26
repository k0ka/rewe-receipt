interface Item {
    timeStamp: string;
    value: number;
}

export default function groupValues(unit: 'day' | 'week' | 'month' | 'year', items: Item[]) {
    const groups = items.reduce<Record<string, number>>((acc, item) => {
        const date = new Date(item.timeStamp);
        let key: string;

        if (unit === 'day') {
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (unit === 'week') {
            // Get the start of the week
            const day = date.getDay();
            const diff = date.getDate() - day;
            const startOfWeek = new Date(date.setDate(diff));
            key = startOfWeek.toISOString().split('T')[0];
        } else if (unit === 'month') {
            key = `${date.getFullYear().toFixed()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`; // YYYY-MM-01
        } else {
            key = `${date.getFullYear().toFixed()}-01-01`; // YYYY-01-01
        }

        acc[key] = (acc[key] || 0) + item.value;
        return acc;
    }, {});

    return Object.entries(groups)
        .map(([date, total]) => ({x: date, y: total}))
        .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
};