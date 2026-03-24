import postgres from 'postgres';
import { Group, Player } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 10;

// ============ GROUPS ============

export async function fetchAllGroups(): Promise<Group[]> {
  try {
    const groups = await sql<Group[]>`
      SELECT id, name
      FROM groups
      ORDER BY name ASC
    `;
    return groups;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups.');
  }
}

export async function fetchGroupsPages(query: string): Promise<number> {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM groups
      WHERE name ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of groups.');
  }
}

export async function fetchFilteredGroups(
  query: string,
  currentPage: number,
): Promise<Group[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const groups = await sql<Group[]>`
      SELECT id, name
      FROM groups
      WHERE name ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return groups;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch groups.');
  }
}

export async function fetchGroupById(id: string): Promise<Group | undefined> {
  try {
    const groups = await sql<Group[]>`
      SELECT id, name
      FROM groups
      WHERE id = ${id}
    `;
    return groups[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch group.');
  }
}

// ============ PLAYERS ============

export type PlayerWithGroups = Player & {
  groups: Group[];
};

export async function fetchPlayersPages(
  query: string,
  groupId?: string,
): Promise<number> {
  try {
    let count;
    if (groupId) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
      `;
    } else {
      count = await sql`
        SELECT COUNT(*)
        FROM players
        WHERE name ILIKE ${`%${query}%`}
      `;
    }
    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of players.');
  }
}

export async function fetchFilteredPlayers(
  query: string,
  currentPage: number,
  groupId?: string,
): Promise<PlayerWithGroups[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let players: Player[];
    
    if (groupId) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      players = await sql<Player[]>`
        SELECT id, name
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    }

    // Fetch groups for each player
    const playersWithGroups: PlayerWithGroups[] = await Promise.all(
      players.map(async (player) => {
        const groups = await sql<Group[]>`
          SELECT g.id, g.name
          FROM groups g
          INNER JOIN group_players gp ON g.id = gp.group_id
          WHERE gp.player_id = ${player.id}
          ORDER BY g.name ASC
        `;
        return { ...player, groups };
      })
    );

    return playersWithGroups;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch players.');
  }
}

export async function fetchPlayerById(id: string): Promise<PlayerWithGroups | undefined> {
  try {
    const players = await sql<Player[]>`
      SELECT id, name
      FROM players
      WHERE id = ${id}
    `;
    
    if (!players[0]) return undefined;

    const groups = await sql<Group[]>`
      SELECT g.id, g.name
      FROM groups g
      INNER JOIN group_players gp ON g.id = gp.group_id
      WHERE gp.player_id = ${id}
      ORDER BY g.name ASC
    `;

    return { ...players[0], groups };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch player.');
  }
}

// ============ INVOICES ============

export type MonthlyInvoice = {
  month: number;
  status: 'paid' | null;
  invoiceId: string | null;
  amount: number;
};

export type PlayerWithInvoices = Player & {
  invoices: MonthlyInvoice[];
};

export async function fetchInvoicePlayersPages(
  query: string,
  groupId?: string,
): Promise<number> {
  try {
    let count;
    if (groupId) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
      `;
    } else {
      count = await sql`
        SELECT COUNT(*)
        FROM players
        WHERE name ILIKE ${`%${query}%`}
      `;
    }
    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of players.');
  }
}

export async function fetchPlayersWithInvoices(
  query: string,
  currentPage: number,
  year: number,
  groupId?: string,
): Promise<PlayerWithInvoices[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let players: Player[];
    
    if (groupId) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      players = await sql<Player[]>`
        SELECT id, name
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    }

    // Fetch invoices for each player for the given year
    const playersWithInvoices: PlayerWithInvoices[] = await Promise.all(
      players.map(async (player) => {
        const invoices = await sql<{ id: string; month: number; status: string; amount: number }[]>`
          SELECT id, month, status, amount
          FROM invoices
          WHERE player_id = ${player.id}
          AND year = ${year}
        `;

        // Create array for all 12 months
        const monthlyInvoices: MonthlyInvoice[] = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const invoice = invoices.find((inv) => inv.month === month);
          return {
            month,
            status: invoice?.status === 'paid' ? 'paid' : null,
            invoiceId: invoice?.id || null,
            amount: invoice?.amount || 0,
          };
        });

        return { ...player, invoices: monthlyInvoices };
      })
    );

    return playersWithInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch players with invoices.');
  }
}

export async function fetchAvailableYears(): Promise<number[]> {
  try {
    const result = await sql<{ year: number }[]>`
      SELECT DISTINCT year
      FROM invoices
      ORDER BY year DESC
    `;
    
    const years = result.map((r) => r.year);
    const currentYear = new Date().getFullYear();
    
    // Always include current year
    if (!years.includes(currentYear)) {
      years.unshift(currentYear);
    }
    
    return years.sort((a, b) => b - a);
  } catch (error) {
    console.error('Database Error:', error);
    // Return current year as fallback
    return [new Date().getFullYear()];
  }
}

// ============ DASHBOARD STATS ============

export type DashboardStats = {
  totalPlayers: number;
  totalGroups: number;
  totalIncome: number;
};

export async function fetchDashboardStats(
  year?: number,
  month?: number,
  groupId?: string,
): Promise<DashboardStats> {
  try {
    // Total players (filtered by group if provided)
    let playersCount;
    if (groupId) {
      playersCount = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId}
      `;
    } else {
      playersCount = await sql`
        SELECT COUNT(*) as count FROM players
      `;
    }

    // Total groups
    const groupsCount = await sql`
      SELECT COUNT(*) as count FROM groups
    `;

    // Total income with filters
    let incomeQuery;
    if (year && month && groupId) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(i.amount), 0) as total
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE i.year = ${year}
        AND i.month = ${month}
        AND gp.group_id = ${groupId}
        AND i.status = 'paid'
      `;
    } else if (year && month) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM invoices
        WHERE year = ${year}
        AND month = ${month}
        AND status = 'paid'
      `;
    } else if (year && groupId) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(i.amount), 0) as total
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE i.year = ${year}
        AND gp.group_id = ${groupId}
        AND i.status = 'paid'
      `;
    } else if (year) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM invoices
        WHERE year = ${year}
        AND status = 'paid'
      `;
    } else if (groupId) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(i.amount), 0) as total
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId}
        AND i.status = 'paid'
      `;
    } else {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM invoices
        WHERE status = 'paid'
      `;
    }

    return {
      totalPlayers: Number(playersCount[0].count),
      totalGroups: Number(groupsCount[0].count),
      totalIncome: Number(incomeQuery[0].total),
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      totalPlayers: 0,
      totalGroups: 0,
      totalIncome: 0,
    };
  }
}
