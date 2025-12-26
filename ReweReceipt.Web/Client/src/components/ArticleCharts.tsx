import type {ArticleReceipt} from "@/api/schemas";
import {
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
    LineElement,
    PointElement,
    TimeSeriesScale,
    Title,
    Tooltip
} from "chart.js";
import {Bar, Scatter} from "react-chartjs-2";
import 'chartjs-adapter-dayjs-4';
import autoUnit from "@/lib/autoUnit.tsx";
import groupValues from "@/lib/groupQuantity.tsx";


interface Props {
    receipts: ArticleReceipt[]
}

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    TimeSeriesScale,
    Title,
    Tooltip,
);

export default function ArticleCharts({receipts}: Props) {
    const unit = autoUnit(receipts.map(receipt => receipt.timeStamp));

    return (
        <>
            <Scatter
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Price History',
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: unit
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Price (€)'
                            }
                        }
                    }
                }}
                data={{
                    datasets: [{
                        label: 'Price (€)',
                        data: receipts.map(receipt => ({
                            x: receipt.timeStamp,
                            y: receipt.price
                        })),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }],
                }}
            />
            <Bar
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Units brought',
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: unit
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Units'
                            }
                        }
                    }
                }}
                data={{
                    datasets: [{
                        label: 'Units',
                        data: groupValues(
                            unit,
                            receipts.map(receipt => ({
                                timeStamp: receipt.timeStamp,
                                value: Number(receipt.quantity)
                            }))
                        ),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    }],
                }}
            />
            <Bar
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Money spent',
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: unit
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Spent (€)'
                            },
                        }
                    }
                }}
                data={{
                    datasets: [{
                        label: 'Spent (€)',
                        data: groupValues(
                            unit,
                            receipts.map(receipt => ({
                                timeStamp: receipt.timeStamp,
                                value: Number(receipt.price)*Number(receipt.quantity)
                            }))
                        ),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    }],
                }}
            />
            
        </>
    );
}