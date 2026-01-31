import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// GET all games for the authenticated user
export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Check authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;

        // Get query parameters for filtering
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");

        // Fetch games from Supabase
        // Note: 'count' option gives us the total number of rows
        const { data: games, count, error: dbError } = await supabase
            .from("games")
            .select("*", { count: "exact" })
            .eq("user_id", userId)
            .order("date", { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        if (dbError) {
            console.error("Supabase error:", dbError);
            throw dbError;
        }

        // Calculate season averages (fetch all for calc)
        // For performance in a real app, you might use a database function or materialized view
        const { data: allGames } = await supabase
            .from("games")
            .select("*")
            .eq("user_id", userId);

        const totalGames = allGames?.length || 0;

        let averages = null;
        if (totalGames > 0 && allGames) {
            const totals = allGames.reduce(
                (acc, game) => ({
                    points: acc.points + (Number(game.points) || 0),
                    rebounds: acc.rebounds + (Number(game.rebounds_off) || 0) + (Number(game.rebounds_def) || 0),
                    assists: acc.assists + (Number(game.assists) || 0),
                    steals: acc.steals + (Number(game.steals) || 0),
                    blocks: acc.blocks + (Number(game.blocks) || 0),
                    turnovers: acc.turnovers + (Number(game.turnovers) || 0),
                    minutes: acc.minutes + (Number(game.minutes) || 0),
                    fgMade: acc.fgMade + (Number(game.fg_made) || 0),
                    fgAttempted: acc.fgAttempted + (Number(game.fg_attempted) || 0),
                    threeMade: acc.threeMade + (Number(game.three_made) || 0),
                    threeAttempted: acc.threeAttempted + (Number(game.three_attempted) || 0),
                    ftMade: acc.ftMade + (Number(game.ft_made) || 0),
                    ftAttempted: acc.ftAttempted + (Number(game.ft_attempted) || 0),
                }),
                {
                    points: 0,
                    rebounds: 0,
                    assists: 0,
                    steals: 0,
                    blocks: 0,
                    turnovers: 0,
                    minutes: 0,
                    fgMade: 0,
                    fgAttempted: 0,
                    threeMade: 0,
                    threeAttempted: 0,
                    ftMade: 0,
                    ftAttempted: 0,
                }
            );

            averages = {
                ppg: (totals.points / totalGames).toFixed(1),
                rpg: (totals.rebounds / totalGames).toFixed(1),
                apg: (totals.assists / totalGames).toFixed(1),
                spg: (totals.steals / totalGames).toFixed(1),
                bpg: (totals.blocks / totalGames).toFixed(1),
                topg: (totals.turnovers / totalGames).toFixed(1),
                mpg: (totals.minutes / totalGames).toFixed(1),
                fgPercentage: totals.fgAttempted > 0 ? ((totals.fgMade / totals.fgAttempted) * 100).toFixed(1) : "0.0",
                threePercentage: totals.threeAttempted > 0 ? ((totals.threeMade / totals.threeAttempted) * 100).toFixed(1) : "0.0",
                ftPercentage: totals.ftAttempted > 0 ? ((totals.ftMade / totals.ftAttempted) * 100).toFixed(1) : "0.0",
            };
        }

        return NextResponse.json({
            games: games || [],
            totalGames: count || 0,
            averages,
            page,
            totalPages: Math.ceil((count || 0) / limit),
        });

    } catch (error) {
        console.error("GET /api/games error:", error);
        return NextResponse.json(
            { error: "Failed to fetch games" },
            { status: 500 }
        );
    }
}

// POST create a new game
export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await req.json();

        // Map camelCase to snake_case for the database
        const gameData = {
            user_id: userId,
            date: body.date,
            opponent: body.opponent,
            minutes: body.minutes,
            points: body.points,
            fg_made: body.fgMade,
            fg_attempted: body.fgAttempted,
            three_made: body.threeMade,
            three_attempted: body.threeAttempted,
            ft_made: body.ftMade,
            ft_attempted: body.ftAttempted,
            rebounds_off: body.offRebounds,
            rebounds_def: body.defRebounds,
            assists: body.assists,
            steals: body.steals,
            blocks: body.blocks,
            turnovers: body.turnovers,
            fouls: body.fouls
        };

        const { data, error } = await supabase
            .from("games")
            .insert(gameData)
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("POST /api/games error:", error);
        return NextResponse.json(
            { error: "Failed to create game" },
            { status: 500 }
        );
    }
}
