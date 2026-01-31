'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface GameStats {
    date: string;
    opponent: string;
    minutes: number;
    points: number;
    fgMade: number;
    fgAttempted: number;
    threeMade: number;
    threeAttempted: number;
    ftMade: number;
    ftAttempted: number;
    offRebounds: number;
    defRebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fouls: number;
}

export default function QuickGameEntry({ isModal = false }: { isModal?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [gameStats, setGameStats] = useState<Partial<GameStats>>({
        date: new Date().toISOString().split('T')[0],
        opponent: '',
        minutes: 0,
        points: 0,
        fgMade: 0,
        fgAttempted: 0,
        threeMade: 0,
        threeAttempted: 0,
        ftMade: 0,
        ftAttempted: 0,
        offRebounds: 0,
        defRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
    });

    const handleInputChange = (field: keyof GameStats, value: string | number) => {
        setGameStats(prev => ({
            ...prev,
            [field]: field === 'opponent' || field === 'date' ? value : Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Submit to API
            const response = await fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameStats),
            });

            if (!response.ok) throw new Error('Failed to save game');

            toast.success('Game saved successfully!');

            // Reset form
            setGameStats({
                date: new Date().toISOString().split('T')[0],
                opponent: '',
                minutes: 0,
                points: 0,
                fgMade: 0,
                fgAttempted: 0,
                threeMade: 0,
                threeAttempted: 0,
                ftMade: 0,
                ftAttempted: 0,
                offRebounds: 0,
                defRebounds: 0,
                assists: 0,
                steals: 0,
                blocks: 0,
                turnovers: 0,
                fouls: 0,
            });
            setIsExpanded(false);

            // Close modal if applicable
            if (isModal) {
                const modal = document.getElementById('quick-entry-modal') as HTMLInputElement;
                if (modal) modal.checked = false;
            }
        } catch (error) {
            toast.error('Failed to save game. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const StatInput = ({ label, field, max }: { label: string; field: keyof GameStats; max?: number }) => (
        <div className="form-control">
            <label className="label">
                <span className="label-text text-xs">{label}</span>
            </label>
            <input
                type="number"
                min="0"
                max={max}
                value={gameStats[field] || 0}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="input input-bordered input-sm text-center"
            />
        </div>
    );

    if (!isModal && !isExpanded) {
        return (
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Quick Game Entry</h2>
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="btn btn-primary btn-sm"
                        >
                            Add Game
                        </button>
                    </div>

                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Last Game</div>
                            <div className="stat-value text-lg">22 pts</div>
                            <div className="stat-desc">vs Washington MS</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Season Avg</div>
                            <div className="stat-value text-lg">14.3 PPG</div>
                            <div className="stat-desc">↗︎ +2.3 last 5 games</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={!isModal ? "card bg-base-200 shadow-xl" : ""}>
            <div className={!isModal ? "card-body" : ""}>
                {!isModal && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Quick Game Entry</h2>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="btn btn-ghost btn-sm"
                        >
                            Collapse
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date</span>
                            </label>
                            <input
                                type="date"
                                value={gameStats.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Opponent</span>
                            </label>
                            <input
                                type="text"
                                value={gameStats.opponent}
                                onChange={(e) => handleInputChange('opponent', e.target.value)}
                                placeholder="Team name"
                                className="input input-bordered"
                                required
                            />
                        </div>
                    </div>

                    <div className="divider">Basic Stats</div>
                    <div className="grid grid-cols-4 gap-3">
                        <StatInput label="Minutes" field="minutes" max={40} />
                        <StatInput label="Points" field="points" />
                        <StatInput label="Assists" field="assists" />
                        <StatInput label="Steals" field="steals" />
                    </div>

                    <div className="divider">Shooting</div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 grid grid-cols-2 gap-3">
                                <StatInput label="FG Made" field="fgMade" />
                                <StatInput label="FG Att" field="fgAttempted" />
                            </div>
                            <div className="stats shadow">
                                <div className="stat p-2">
                                    <div className="stat-title text-xs">FG%</div>
                                    <div className="stat-value text-lg">
                                        {gameStats.fgAttempted && gameStats.fgAttempted > 0
                                            ? ((gameStats.fgMade! / gameStats.fgAttempted) * 100).toFixed(1)
                                            : '0.0'}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 grid grid-cols-2 gap-3">
                                <StatInput label="3PT Made" field="threeMade" />
                                <StatInput label="3PT Att" field="threeAttempted" />
                            </div>
                            <div className="stats shadow">
                                <div className="stat p-2">
                                    <div className="stat-title text-xs">3P%</div>
                                    <div className="stat-value text-lg">
                                        {gameStats.threeAttempted && gameStats.threeAttempted > 0
                                            ? ((gameStats.threeMade! / gameStats.threeAttempted) * 100).toFixed(1)
                                            : '0.0'}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 grid grid-cols-2 gap-3">
                                <StatInput label="FT Made" field="ftMade" />
                                <StatInput label="FT Att" field="ftAttempted" />
                            </div>
                            <div className="stats shadow">
                                <div className="stat p-2">
                                    <div className="stat-title text-xs">FT%</div>
                                    <div className="stat-value text-lg">
                                        {gameStats.ftAttempted && gameStats.ftAttempted > 0
                                            ? ((gameStats.ftMade! / gameStats.ftAttempted) * 100).toFixed(1)
                                            : '0.0'}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divider">Rebounds & More</div>
                    <div className="grid grid-cols-5 gap-3">
                        <StatInput label="Off Reb" field="offRebounds" />
                        <StatInput label="Def Reb" field="defRebounds" />
                        <StatInput label="Blocks" field="blocks" />
                        <StatInput label="TO" field="turnovers" />
                        <StatInput label="Fouls" field="fouls" max={5} />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className={`btn btn-success flex-1 ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Game'}
                        </button>
                        {!isModal && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsExpanded(false);
                                    setGameStats({
                                        date: new Date().toISOString().split('T')[0],
                                        opponent: '',
                                        minutes: 0,
                                        points: 0,
                                        fgMade: 0,
                                        fgAttempted: 0,
                                        threeMade: 0,
                                        threeAttempted: 0,
                                        ftMade: 0,
                                        ftAttempted: 0,
                                        offRebounds: 0,
                                        defRebounds: 0,
                                        assists: 0,
                                        steals: 0,
                                        blocks: 0,
                                        turnovers: 0,
                                        fouls: 0,
                                    });
                                }}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
