import postgres from 'postgres';
import { Group, Player } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_SSL === 'true' ? 'require' : false,
});

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
  status?: string,
): Promise<number> {
  try {
    let count;
    const isActive = status === 'active' ? true : status === 'inactive' ? false : null;
    
    if (groupId && isActive !== null) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        AND p.is_active = ${isActive}
      `;
    } else if (groupId) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
      `;
    } else if (isActive !== null) {
      count = await sql`
        SELECT COUNT(*)
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        AND is_active = ${isActive}
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
  status?: string,
): Promise<PlayerWithGroups[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const isActive = status === 'active' ? true : status === 'inactive' ? false : null;

  try {
    let players: Player[];
    
    if (groupId && isActive !== null) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name, p.birthdate, p.phone, p.address, p.is_active
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        AND p.is_active = ${isActive}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else if (groupId) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name, p.birthdate, p.phone, p.address, p.is_active
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else if (isActive !== null) {
      players = await sql<Player[]>`
        SELECT id, name, birthdate, phone, address, is_active
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        AND is_active = ${isActive}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      players = await sql<Player[]>`
        SELECT id, name, birthdate, phone, address, is_active
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
        return { 
          ...player, 
          is_active: player.is_active ?? true,
          groups 
        };
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
      SELECT id, name, TO_CHAR(birthdate, 'YYYY-MM-DD') as birthdate, phone, address, is_active
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

    return { 
      ...players[0], 
      is_active: players[0].is_active ?? true,
      groups 
    };
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
  status?: string,
): Promise<number> {
  try {
    let count;
    const isActive = status === 'active' ? true : status === 'inactive' ? false : null;
    
    if (groupId && isActive !== null) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        AND p.is_active = ${isActive}
      `;
    } else if (groupId) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
      `;
    } else if (isActive !== null) {
      count = await sql`
        SELECT COUNT(*)
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        AND is_active = ${isActive}
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
  status?: string,
): Promise<PlayerWithInvoices[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const isActive = status === 'active' ? true : status === 'inactive' ? false : null;

  try {
    let players: Player[];
    
    if (groupId && isActive !== null) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        AND p.is_active = ${isActive}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else if (groupId) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else if (isActive !== null) {
      players = await sql<Player[]>`
        SELECT id, name
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        AND is_active = ${isActive}
        ORDER BY name ASC
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

// ============ PRESENCES ============

export type MonthlyPresence = {
  month: number;
  count: number;
  presenceId: string | null;
};

export type PlayerWithPresences = Player & {
  presences: MonthlyPresence[];
};

export async function fetchPresencePlayersPages(
  query: string,
  groupId?: string,
  status?: string,
): Promise<number> {
  try {
    let count;
    const isActive = status === 'active' ? true : status === 'inactive' ? false : null;
    
    if (groupId && isActive !== null) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        AND p.is_active = ${isActive}
      `;
    } else if (groupId) {
      count = await sql`
        SELECT COUNT(DISTINCT p.id)
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
      `;
    } else if (isActive !== null) {
      count = await sql`
        SELECT COUNT(*)
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        AND is_active = ${isActive}
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

export async function fetchPlayersWithPresences(
  query: string,
  currentPage: number,
  year: number,
  groupId?: string,
  status?: string,
): Promise<PlayerWithPresences[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const isActive = status === 'active' ? true : status === 'inactive' ? false : null;

  try {
    let players: Player[];
    
    if (groupId && isActive !== null) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        AND p.is_active = ${isActive}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else if (groupId) {
      players = await sql<Player[]>`
        SELECT DISTINCT p.id, p.name
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.name ILIKE ${`%${query}%`}
        AND gp.group_id = ${groupId}
        ORDER BY p.name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else if (isActive !== null) {
      players = await sql<Player[]>`
        SELECT id, name
        FROM players
        WHERE name ILIKE ${`%${query}%`}
        AND is_active = ${isActive}
        ORDER BY name ASC
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

    // Fetch presences for each player for the given year
    const playersWithPresences: PlayerWithPresences[] = await Promise.all(
      players.map(async (player) => {
        const presences = await sql<{ id: string; month: number; count: number }[]>`
          SELECT id, month, count
          FROM presences
          WHERE player_id = ${player.id}
          AND year = ${year}
        `;

        // Create array for all 12 months
        const monthlyPresences: MonthlyPresence[] = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const presence = presences.find((p) => p.month === month);
          return {
            month,
            count: presence?.count || 0,
            presenceId: presence?.id || null,
          };
        });

        return { ...player, presences: monthlyPresences };
      })
    );

    return playersWithPresences;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch players with presences.');
  }
}

export async function fetchPresenceAvailableYears(): Promise<number[]> {
  try {
    const result = await sql<{ year: number }[]>`
      SELECT DISTINCT year
      FROM presences
      ORDER BY year DESC
    `;
    
    const years = result.map((r) => r.year);
    const currentYear = new Date().getFullYear();
    
    if (!years.includes(currentYear)) {
      years.unshift(currentYear);
    }
    
    return years.sort((a, b) => b - a);
  } catch (error) {
    console.error('Database Error:', error);
    return [new Date().getFullYear()];
  }
}

// ============ DASHBOARD STATS ============

export type DashboardStats = {
  totalPlayers: number;
  activePlayers: number;
  inactivePlayers: number;
  totalGroups: number;
  totalIncome: number;
  totalPresences: number;
  paidInvoicesCount: number;
  unpaidPlayersCount: number;
  recentPlayers: { id: string; name: string; created_at: string }[];
  topAttendance: { id: string; name: string; total: number }[];
  monthlyIncome: { month: number; total: number }[];
};

export async function fetchDashboardStats(
  year?: number,
  month?: number,
  groupId?: string,
): Promise<DashboardStats> {
  const filterYear = year || new Date().getFullYear();
  const filterMonth = month || new Date().getMonth() + 1;
  
  try {
    // Total players (filtered by group if provided)
    let playersCount;
    let activePlayersCount;
    let inactivePlayersCount;
    
    if (groupId) {
      playersCount = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId}
      `;
      activePlayersCount = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId} AND p.is_active = true
      `;
      inactivePlayersCount = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId} AND p.is_active = false
      `;
    } else {
      playersCount = await sql`SELECT COUNT(*) as count FROM players`;
      activePlayersCount = await sql`SELECT COUNT(*) as count FROM players WHERE is_active = true`;
      inactivePlayersCount = await sql`SELECT COUNT(*) as count FROM players WHERE is_active = false`;
    }

    // Total groups
    const groupsCount = await sql`SELECT COUNT(*) as count FROM groups`;

    // Total income with filters
    let incomeQuery;
    if (year && month && groupId) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(i.amount), 0) as total
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE i.year = ${year} AND i.month = ${month} AND gp.group_id = ${groupId} AND i.status = 'paid'
      `;
    } else if (year && month) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(amount), 0) as total FROM invoices
        WHERE year = ${year} AND month = ${month} AND status = 'paid'
      `;
    } else if (year && groupId) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(i.amount), 0) as total
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE i.year = ${year} AND gp.group_id = ${groupId} AND i.status = 'paid'
      `;
    } else if (year) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE year = ${year} AND status = 'paid'
      `;
    } else if (groupId) {
      incomeQuery = await sql`
        SELECT COALESCE(SUM(i.amount), 0) as total
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId} AND i.status = 'paid'
      `;
    } else {
      incomeQuery = await sql`SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'paid'`;
    }

    // Total presences with filters (year, month, groupId)
    let presencesCount;
    if (year && month && groupId) {
      presencesCount = await sql`
        SELECT COALESCE(SUM(pr.count), 0) as total
        FROM presences pr
        INNER JOIN players p ON pr.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE pr.year = ${year} AND pr.month = ${month} AND gp.group_id = ${groupId}
      `;
    } else if (year && month) {
      presencesCount = await sql`
        SELECT COALESCE(SUM(count), 0) as total FROM presences WHERE year = ${year} AND month = ${month}
      `;
    } else if (year && groupId) {
      presencesCount = await sql`
        SELECT COALESCE(SUM(pr.count), 0) as total
        FROM presences pr
        INNER JOIN players p ON pr.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE pr.year = ${year} AND gp.group_id = ${groupId}
      `;
    } else if (year) {
      presencesCount = await sql`
        SELECT COALESCE(SUM(count), 0) as total FROM presences WHERE year = ${year}
      `;
    } else if (groupId) {
      presencesCount = await sql`
        SELECT COALESCE(SUM(pr.count), 0) as total
        FROM presences pr
        INNER JOIN players p ON pr.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId}
      `;
    } else {
      presencesCount = await sql`SELECT COALESCE(SUM(count), 0) as total FROM presences`;
    }

    // Paid invoices count with filters
    let paidCount;
    if (year && month && groupId) {
      paidCount = await sql`
        SELECT COUNT(*) as count
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE i.year = ${year} AND i.month = ${month} AND gp.group_id = ${groupId} AND i.status = 'paid'
      `;
    } else if (year && month) {
      paidCount = await sql`
        SELECT COUNT(*) as count FROM invoices WHERE year = ${year} AND month = ${month} AND status = 'paid'
      `;
    } else if (year && groupId) {
      paidCount = await sql`
        SELECT COUNT(*) as count
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE i.year = ${year} AND gp.group_id = ${groupId} AND i.status = 'paid'
      `;
    } else if (year) {
      paidCount = await sql`
        SELECT COUNT(*) as count FROM invoices WHERE year = ${year} AND status = 'paid'
      `;
    } else if (groupId) {
      paidCount = await sql`
        SELECT COUNT(*) as count
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId} AND i.status = 'paid'
      `;
    } else {
      paidCount = await sql`SELECT COUNT(*) as count FROM invoices WHERE status = 'paid'`;
    }

    // Players who haven't paid (uses filter year/month, or current if not specified)
    let unpaidPlayers;
    if (groupId) {
      unpaidPlayers = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE p.is_active = true
        AND gp.group_id = ${groupId}
        AND NOT EXISTS (
          SELECT 1 FROM invoices i 
          WHERE i.player_id = p.id 
          AND i.year = ${filterYear} 
          AND i.month = ${filterMonth}
          AND i.status = 'paid'
        )
      `;
    } else {
      unpaidPlayers = await sql`
        SELECT COUNT(DISTINCT p.id) as count
        FROM players p
        WHERE p.is_active = true
        AND NOT EXISTS (
          SELECT 1 FROM invoices i 
          WHERE i.player_id = p.id 
          AND i.year = ${filterYear} 
          AND i.month = ${filterMonth}
          AND i.status = 'paid'
        )
      `;
    }

    // Recent players (filtered by group if provided)
    let recentPlayers;
    if (groupId) {
      recentPlayers = await sql<{ id: string; name: string; created_at: string }[]>`
        SELECT p.id, p.name, p.created_at 
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE gp.group_id = ${groupId}
        ORDER BY p.created_at DESC LIMIT 5
      `;
    } else {
      recentPlayers = await sql<{ id: string; name: string; created_at: string }[]>`
        SELECT id, name, created_at FROM players ORDER BY created_at DESC LIMIT 5
      `;
    }

    // Top attendance with filters (year, month, groupId)
    let topAttendance;
    if (year && month && groupId) {
      topAttendance = await sql<{ id: string; name: string; total: number }[]>`
        SELECT p.id, p.name, COALESCE(SUM(pr.count), 0) as total
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        LEFT JOIN presences pr ON p.id = pr.player_id AND pr.year = ${year} AND pr.month = ${month}
        WHERE p.is_active = true AND gp.group_id = ${groupId}
        GROUP BY p.id, p.name
        ORDER BY total DESC
        LIMIT 5
      `;
    } else if (year && month) {
      topAttendance = await sql<{ id: string; name: string; total: number }[]>`
        SELECT p.id, p.name, COALESCE(SUM(pr.count), 0) as total
        FROM players p
        LEFT JOIN presences pr ON p.id = pr.player_id AND pr.year = ${year} AND pr.month = ${month}
        WHERE p.is_active = true
        GROUP BY p.id, p.name
        ORDER BY total DESC
        LIMIT 5
      `;
    } else if (year && groupId) {
      topAttendance = await sql<{ id: string; name: string; total: number }[]>`
        SELECT p.id, p.name, COALESCE(SUM(pr.count), 0) as total
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        LEFT JOIN presences pr ON p.id = pr.player_id AND pr.year = ${year}
        WHERE p.is_active = true AND gp.group_id = ${groupId}
        GROUP BY p.id, p.name
        ORDER BY total DESC
        LIMIT 5
      `;
    } else if (year) {
      topAttendance = await sql<{ id: string; name: string; total: number }[]>`
        SELECT p.id, p.name, COALESCE(SUM(pr.count), 0) as total
        FROM players p
        LEFT JOIN presences pr ON p.id = pr.player_id AND pr.year = ${year}
        WHERE p.is_active = true
        GROUP BY p.id, p.name
        ORDER BY total DESC
        LIMIT 5
      `;
    } else if (groupId) {
      topAttendance = await sql<{ id: string; name: string; total: number }[]>`
        SELECT p.id, p.name, COALESCE(SUM(pr.count), 0) as total
        FROM players p
        INNER JOIN group_players gp ON p.id = gp.player_id
        LEFT JOIN presences pr ON p.id = pr.player_id
        WHERE p.is_active = true AND gp.group_id = ${groupId}
        GROUP BY p.id, p.name
        ORDER BY total DESC
        LIMIT 5
      `;
    } else {
      topAttendance = await sql<{ id: string; name: string; total: number }[]>`
        SELECT p.id, p.name, COALESCE(SUM(pr.count), 0) as total
        FROM players p
        LEFT JOIN presences pr ON p.id = pr.player_id
        WHERE p.is_active = true
        GROUP BY p.id, p.name
        ORDER BY total DESC
        LIMIT 5
      `;
    }

    // Monthly income for selected year (with group filter if provided)
    let monthlyIncome;
    if (groupId) {
      monthlyIncome = await sql<{ month: number; total: number }[]>`
        SELECT i.month, COALESCE(SUM(i.amount), 0) as total
        FROM invoices i
        INNER JOIN players p ON i.player_id = p.id
        INNER JOIN group_players gp ON p.id = gp.player_id
        WHERE i.year = ${filterYear} AND i.status = 'paid' AND gp.group_id = ${groupId}
        GROUP BY i.month
        ORDER BY i.month
      `;
    } else {
      monthlyIncome = await sql<{ month: number; total: number }[]>`
        SELECT month, COALESCE(SUM(amount), 0) as total
        FROM invoices
        WHERE year = ${filterYear} AND status = 'paid'
        GROUP BY month
        ORDER BY month
      `;
    }

    return {
      totalPlayers: Number(playersCount[0].count),
      activePlayers: Number(activePlayersCount[0].count),
      inactivePlayers: Number(inactivePlayersCount[0].count),
      totalGroups: Number(groupsCount[0].count),
      totalIncome: Number(incomeQuery[0].total),
      totalPresences: Number(presencesCount[0].total),
      paidInvoicesCount: Number(paidCount[0].count),
      unpaidPlayersCount: Number(unpaidPlayers[0].count),
      recentPlayers,
      topAttendance,
      monthlyIncome,
    };
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return {
      totalPlayers: 0,
      activePlayers: 0,
      inactivePlayers: 0,
      totalGroups: 0,
      totalIncome: 0,
      totalPresences: 0,
      paidInvoicesCount: 0,
      unpaidPlayersCount: 0,
      recentPlayers: [],
      topAttendance: [],
      monthlyIncome: [],
    };
  }
}
