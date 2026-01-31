'use client';

export default function ProgressTracking() {
    const goals = [
        { label: 'FT%', current: 67, target: 70, color: 'primary' },
        { label: 'FG%', current: 42, target: 45, color: 'success' },
        { label: '3P%', current: 28, target: 33, color: 'secondary' },
        { label: 'PPG', current: 14.3, target: 15, color: 'accent' },
    ];

    return (
        <div className="card bg-base-200">
            <div className="card-body">
                <h2 className="card-title">Progress to Goals</h2>
                <div className="space-y-4">
                    {goals.map((goal) => (
                        <div key={goal.label}>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">{goal.label}</span>
                                <span className="text-sm">{goal.current}/{goal.target}</span>
                            </div>
                            <progress
                                className={`progress progress-${goal.color}`}
                                value={goal.current}
                                max={goal.target}
                            ></progress>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
