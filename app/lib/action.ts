'use server'

import postgres from 'postgres';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
 
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_SSL === 'true' ? 'require' : false,
});

// Group Schema
const GroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  region: z.enum(['Surabaya', 'Sidoarjo']).default('Surabaya'),
});

const CreateGroup = GroupSchema.omit({ id: true });
const UpdateGroup = GroupSchema;

export type GroupState = {
  errors?: {
    name?: string[];
    region?: string[];
  };
  message?: string | null;
};

export async function createGroup(
  prevState: GroupState,
  formData: FormData,
): Promise<GroupState> {
  const validatedFields = CreateGroup.safeParse({
    name: formData.get('name'),
    region: formData.get('region') || 'Surabaya',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Group.',
    };
  }

  const { name, region } = validatedFields.data;

  try {
    await sql`
      INSERT INTO groups (name, region)
      VALUES (${name}, ${region})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Group.' };
  }

  revalidatePath('/dashboard/groups');
  redirect('/dashboard/groups');
}

export async function updateGroup(
  id: string,
  prevState: GroupState,
  formData: FormData,
): Promise<GroupState> {
  const validatedFields = UpdateGroup.safeParse({
    id: id,
    name: formData.get('name'),
    region: formData.get('region') || 'Surabaya',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Group.',
    };
  }

  const { name, region } = validatedFields.data;

  try {
    await sql`
      UPDATE groups
      SET name = ${name}, region = ${region}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Group.' };
  }

  revalidatePath('/dashboard/groups');
  redirect('/dashboard/groups');
}

export async function deleteGroup(id: string): Promise<void> {
  try {
    await sql`DELETE FROM groups WHERE id = ${id}`;
    revalidatePath('/dashboard/groups');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Delete Group.');
  }
}

// ============ PLAYERS ============

const PlayerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  nik: z.string().length(16, 'NIK must be 16 characters'),
  email: z.string().email('Invalid email format'),
  birth_place: z.string().min(1, 'Birth place is required'),
  region: z.enum(['Surabaya', 'Sidoarjo']).default('Surabaya'),
  groupIds: z.array(z.string().uuid()).optional(),
  birthdate: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  is_active: z.boolean().optional(),
});

const CreatePlayer = PlayerSchema.omit({ id: true });
const UpdatePlayer = PlayerSchema;

export type PlayerState = {
  errors?: {
    name?: string[];
    nik?: string[];
    email?: string[];
    birth_place?: string[];
    region?: string[];
    groupIds?: string[];
    birthdate?: string[];
    phone?: string[];
    address?: string[];
  };
  message?: string | null;
};

export async function createPlayer(
  prevState: PlayerState,
  formData: FormData,
): Promise<PlayerState> {
  const groupIds = formData.getAll('groupIds') as string[];
  const nikInput = formData.get('nik') as string;
  const emailInput = formData.get('email') as string;
  const birthPlaceInput = formData.get('birth_place') as string;
  const regionInput = formData.get('region') as string || 'Surabaya';
  const birthdate = formData.get('birthdate') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const isActive = formData.get('is_active') === 'on';
  
  const validatedFields = CreatePlayer.safeParse({
    name: formData.get('name'),
    nik: nikInput,
    email: emailInput,
    birth_place: birthPlaceInput,
    region: regionInput,
    groupIds: groupIds.length > 0 ? groupIds : undefined,
    birthdate: birthdate || undefined,
    phone: phone || undefined,
    address: address || undefined,
    is_active: isActive,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Player.',
    };
  }

  const { name, nik, email, birth_place, region, groupIds: validGroupIds, birthdate: bdate, phone: ph, address: addr, is_active } = validatedFields.data;

  try {
    // Validate groups are in the same region
    if (validGroupIds && validGroupIds.length > 0) {
      const groupsData = await sql<{ id: string; region: string }[]>`
        SELECT id, region FROM groups WHERE id = ANY(${validGroupIds}::uuid[])
      `;
      const invalidGroups = groupsData.filter((g) => g.region !== region);
      if (invalidGroups.length > 0) {
        return { message: `Failed: Selected groups are not in ${region} region.` };
      }
    }

    // Insert player and get the new ID
    const result = await sql`
      INSERT INTO players (name, nik, email, birth_place, region, birthdate, phone, address, is_active)
      VALUES (${name}, ${nik}, ${email}, ${birth_place}, ${region}, ${bdate || null}, ${ph || null}, ${addr || null}, ${is_active ?? true})
      RETURNING id
    `;
    
    const playerId = result[0].id;

    // Insert group associations
    if (validGroupIds && validGroupIds.length > 0) {
      for (const groupId of validGroupIds) {
        await sql`
          INSERT INTO group_players (group_id, player_id)
          VALUES (${groupId}, ${playerId})
        `;
      }
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Player.' };
  }

  revalidatePath('/dashboard/players');
  redirect('/dashboard/players');
}

export async function updatePlayer(
  id: string,
  prevState: PlayerState,
  formData: FormData,
): Promise<PlayerState> {
  const groupIds = formData.getAll('groupIds') as string[];
  const nikInput = formData.get('nik') as string;
  const emailInput = formData.get('email') as string;
  const birthPlaceInput = formData.get('birth_place') as string;
  const regionInput = formData.get('region') as string || 'Surabaya';
  const birthdate = formData.get('birthdate') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const isActive = formData.get('is_active') === 'on';

  const validatedFields = UpdatePlayer.safeParse({
    id: id,
    name: formData.get('name'),
    nik: nikInput,
    email: emailInput,
    birth_place: birthPlaceInput,
    region: regionInput,
    groupIds: groupIds.length > 0 ? groupIds : undefined,
    birthdate: birthdate || undefined,
    phone: phone || undefined,
    address: address || undefined,
    is_active: isActive,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Player.',
    };
  }

  const { name, nik, email, birth_place, region, groupIds: validGroupIds, birthdate: bdate, phone: ph, address: addr, is_active } = validatedFields.data;

  try {
    // Validate groups are in the same region
    if (validGroupIds && validGroupIds.length > 0) {
      const groupsData = await sql<{ id: string; region: string }[]>`
        SELECT id, region FROM groups WHERE id = ANY(${validGroupIds}::uuid[])
      `;
      const invalidGroups = groupsData.filter((g) => g.region !== region);
      if (invalidGroups.length > 0) {
        return { message: `Failed: Selected groups are not in ${region} region.` };
      }
    }

    // Update player
    await sql`
      UPDATE players
      SET name = ${name},
          nik = ${nik},
          email = ${email},
          birth_place = ${birth_place},
          region = ${region},
          birthdate = ${bdate || null},
          phone = ${ph || null},
          address = ${addr || null},
          is_active = ${is_active ?? true},
          updated_at = NOW()
      WHERE id = ${id}
    `;

    // Delete existing group associations
    await sql`
      DELETE FROM group_players
      WHERE player_id = ${id}
    `;

    // Insert new group associations
    if (validGroupIds && validGroupIds.length > 0) {
      for (const groupId of validGroupIds) {
        await sql`
          INSERT INTO group_players (group_id, player_id)
          VALUES (${groupId}, ${id})
        `;
      }
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Player.' };
  }

  revalidatePath('/dashboard/players');
  redirect('/dashboard/players');
}

export async function deletePlayer(id: string): Promise<void> {
  try {
    // Delete group associations first
    await sql`DELETE FROM group_players WHERE player_id = ${id}`;
    // Delete player
    await sql`DELETE FROM players WHERE id = ${id}`;
    revalidatePath('/dashboard/players');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to Delete Player.');
  }
}

// ============ INVOICES ============

export async function toggleInvoice(
  playerId: string,
  month: number,
  year: number,
  currentStatus: 'paid' | null,
  invoiceId: string | null,
  amount: number = 0,
): Promise<void> {
  try {
    if (currentStatus === 'paid' && invoiceId && amount === 0) {
      // Delete the invoice (mark as unpaid)
      await sql`
        DELETE FROM invoices
        WHERE id = ${invoiceId}
      `;
    } else if (currentStatus === 'paid' && invoiceId) {
      // Update existing invoice amount
      await sql`
        UPDATE invoices
        SET amount = ${amount}, updated_at = NOW()
        WHERE id = ${invoiceId}
      `;
    } else {
      // Create new invoice (mark as paid)
      await sql`
        INSERT INTO invoices (player_id, amount, month, year, status)
        VALUES (${playerId}, ${amount}, ${month}, ${year}, 'paid')
      `;
    }
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to toggle invoice.');
  }
}

// ============ PRESENCES ============

export async function updatePresence(
  playerId: string,
  month: number,
  year: number,
  count: number,
  presenceId: string | null,
): Promise<void> {
  try {
    if (presenceId) {
      // Update existing presence
      await sql`
        UPDATE presences
        SET count = ${count}, updated_at = NOW()
        WHERE id = ${presenceId}
      `;
    } else {
      // Create new presence record
      await sql`
        INSERT INTO presences (player_id, month, year, count)
        VALUES (${playerId}, ${month}, ${year}, ${count})
      `;
    }
    revalidatePath('/dashboard/presences');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to update presence.');
  }
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
  