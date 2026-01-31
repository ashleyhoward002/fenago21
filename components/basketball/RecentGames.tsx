'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function RecentGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await fetch('/api/games');
            const data = await response.json();
            setGames(data.games || []);
        } catch (error) {
            toast.error('Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading loading-spinner loading-lg"></div>;

    return (
        <div className="card bg-base-200">
            <div className="card-body">
                <h2 className="card-title">Recent Games</h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Opponent</th>
                                <th>MIN</th>
                                <th>PTS</th>
                                <th>REB</th>
                                <th>AST</th>
                                <th>FG%</th>
                                <th>3P%</th>
                                <th>FT%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.length > 0 ? (
                                games.map((game: any) => (
                                    <tr key={game._id}>
                                        <td>{new Date(game.date).toLocaleDateString()}</td>
                                        <td>{game.opponent}</td>
                                        <td>{game.minutes}</td>
                                        <td className="font-bold">{game.points}</td>
                                        <td>{game.totalRebounds}</td>
                                        <td>{game.assists}</td>
                                        <td>{game.fgPercentage?.toFixed(1)}%</td>
                                        <td>{game.threePercentage?.toFixed(1)}%</td>
                                        <td>{game.ftPercentage?.toFixed(1)}%</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center">No games recorded yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
